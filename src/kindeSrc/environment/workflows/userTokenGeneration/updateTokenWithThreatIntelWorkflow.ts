/**
 * AbuseIPDB Token Generation Workflow
 * 
 * This workflow adds AbuseIPDB configuration and the user's last known abuse score to ID tokens.
 * It reads the abuse score from user properties (set by post-authentication workflow) and
 * adds it along with configuration values to the token.
 * 
 * Environment Variables Required:
 * - ABUSEIPDB_BLOCK_THRESHOLD: A number from 0-100 (0 for very low risk, 100 for guaranteed high risk)
 * - ABUSEIPDB_CACHE_EXPIRY_SECONDS: How long to cache the AbuseIPDB results in seconds
 * - ABUSEIPDB_CACHE_URL: The URL for your caching service (e.g., Upstash Redis REST URL)
 * - ABUSEIPDB_FAIL_OPEN: Set to "TRUE" to allow access when API is unavailable (default: FALSE - blocks access)
 * - KINDE_DOMAIN: Your Kinde domain for Management API calls
 * - KINDE_WF_M2M_CLIENT_ID: Your Kinde M2M client ID for Management API calls
 * - KINDE_WF_M2M_CLIENT_SECRET: Your Kinde M2M client secret for Management API calls
 */

import {
    onUserTokenGeneratedEvent,
    WorkflowSettings,
    WorkflowTrigger,
    idTokenCustomClaims,
    getEnvironmentVariable,
    fetch,
  } from '@kinde/infrastructure';
  
  // --- Workflow Settings ---
  
  export const workflowSettings: WorkflowSettings = {
    id: 'abuseIpdbTokenGeneration',
    name: 'Add AbuseIPDB configuration and abuse score to ID token claims',
    failurePolicy: { action: 'stop' },
    trigger: WorkflowTrigger.UserTokenGeneration,
    bindings: {
      'kinde.idToken': {}, // required to modify ID token claims
      'kinde.env': {}, // required to access environment variables
      'kinde.fetch': {}, // required for Management API calls
    },
  };
  
  // --- Helper Functions ---
  
  /**
   * Safely retrieves an environment variable.
   * @param varName The name of the environment variable.
   * @returns The value of the environment variable, or null if not found.
   */
  function getEnvVar(varName: string): string | null {
    const envVar = getEnvironmentVariable(varName);
    if (!envVar?.value) {
      console.error(`Configuration error: Missing environment variable "${varName}".`);
      return null;
    }
    return envVar.value;
  }
  
  /**
   * Retrieves a user property from Kinde using the Management API.
   * @param userId The user ID to get properties for.
   * @param propertyName The name of the property to retrieve.
   * @param kindeDomain The Kinde domain for the API call.
   * @param clientId The client ID for authentication.
   * @param clientSecret The client secret for authentication.
   * @returns The property value if found, null otherwise.
   */
  async function getUserProperty(
    userId: string,
    propertyName: string,
    kindeDomain: string,
    clientId: string,
    clientSecret: string
  ): Promise<string | null> {
    try {
      // Ensure the domain has the https:// protocol
      const fullDomain = kindeDomain.startsWith('http') ? kindeDomain : `https://${kindeDomain}`;
      
      // First, get an access token for the Management API using M2M credentials
      const formData = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&audience=${encodeURIComponent(fullDomain)}/api`;
  
      const tokenResponse = await fetch(`${fullDomain}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      
      let accessToken: string;
      
      // Check if the response has data property (Kinde fetch pattern)
      if (tokenResponse.data) {
        const tokenData = tokenResponse.data;
        
        // Check if there's an error in the response
        if (tokenData.error) {
          throw new Error(`OAuth error: ${tokenData.error} - ${tokenData.error_description}`);
        }
        
        accessToken = tokenData.access_token;
      } else {
        // Try standard fetch response pattern
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
      }
      
      if (!accessToken) {
        throw new Error('No access token in response');
      }
  
      // Get the user properties using the correct Management API endpoint
      const propertiesUrl = `${fullDomain}/api/v1/users/${userId}/properties`;
      
      const propertiesResponse = await fetch(propertiesUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      let propertiesData: any;
      
      // Check if the response has data property (Kinde fetch pattern)
      if (propertiesResponse.data) {
        propertiesData = propertiesResponse.data;
      } else {
        // Try standard fetch response pattern
        propertiesData = await propertiesResponse.json();
      }
      
      const properties = propertiesData.properties || [];
  
      // Find the specific property by key (not name)
      const targetProperty = properties.find((prop: any) => prop.key === propertyName);
      
      if (targetProperty) {
        console.log(`Found property: ${propertyName} = ${targetProperty.value}`);
        return targetProperty.value;
      } else {
        console.log(`Property not found: ${propertyName}`);
        console.log(`Available properties: ${properties.map((p: any) => `${p.key}=${p.value}`).join(', ')}`);
        return null;
      }
    } catch (error) {
      console.warn(`Failed to get user property ${propertyName}:`, error);
      return null;
    }
  }
  
  // --- Main Workflow Function ---
  
  export default async function AbuseIpdbTokenWorkflow(event: onUserTokenGeneratedEvent) {
    // Get all ABUSEIPDB environment variables
    const blockThreshold = getEnvVar('ABUSEIPDB_BLOCK_THRESHOLD');
    const cacheExpirySeconds = getEnvVar('ABUSEIPDB_CACHE_EXPIRY_SECONDS');
    const cacheUrl = getEnvVar('ABUSEIPDB_CACHE_URL');
    const cacheTokenRead = getEnvVar('ABUSEIPDB_CACHE_TOKEN_READ');
    const failOpen = getEnvVar('ABUSEIPDB_FAIL_OPEN');
    
    // Get Kinde Management API credentials
    const kindeDomain = getEnvVar('KINDE_DOMAIN');
    const clientId = getEnvVar('KINDE_WF_M2M_CLIENT_ID');
    const clientSecret = getEnvVar('KINDE_WF_M2M_CLIENT_SECRET');
  
    // Set the types for the custom claims
    const idToken = idTokenCustomClaims<{
      abuseIpdbBlockThreshold: number | null;
      abuseIpdbCacheExpirySeconds: number | null;
      abuseIpdbCacheUrl: string | null;
      abuseIpdbFailOpen: boolean | null;
      abuseIpdbCurrentScore: number | null;
    }>();
  
    // Process ABUSEIPDB_BLOCK_THRESHOLD
    if (blockThreshold) {
      const blockThresholdNumber = parseInt(blockThreshold, 10);
      if (!isNaN(blockThresholdNumber) && blockThresholdNumber >= 0 && blockThresholdNumber <= 100) {
        idToken.abuseIpdbBlockThreshold = blockThresholdNumber;
      } else {
        console.warn(`Invalid ABUSEIPDB_BLOCK_THRESHOLD value: "${blockThreshold}". Expected a number between 0-100.`);
        idToken.abuseIpdbBlockThreshold = null;
      }
    } else {
      console.warn('ABUSEIPDB_BLOCK_THRESHOLD environment variable not found.');
      idToken.abuseIpdbBlockThreshold = null;
    }
  
    // Process ABUSEIPDB_CACHE_EXPIRY_SECONDS
    if (cacheExpirySeconds) {
      const cacheExpiryNumber = parseInt(cacheExpirySeconds, 10);
      if (!isNaN(cacheExpiryNumber) && cacheExpiryNumber > 0) {
        idToken.abuseIpdbCacheExpirySeconds = cacheExpiryNumber;
      } else {
        console.warn(`Invalid ABUSEIPDB_CACHE_EXPIRY_SECONDS value: "${cacheExpirySeconds}". Expected a positive number.`);
        idToken.abuseIpdbCacheExpirySeconds = null;
      }
    } else {
      console.warn('ABUSEIPDB_CACHE_EXPIRY_SECONDS environment variable not found.');
      idToken.abuseIpdbCacheExpirySeconds = null;
    }
  
    // Process ABUSEIPDB_CACHE_URL
    if (cacheUrl) {
      idToken.abuseIpdbCacheUrl = cacheUrl;
    } else {
      console.warn('ABUSEIPDB_CACHE_URL environment variable not found.');
      idToken.abuseIpdbCacheUrl = null;
    }
  
    // Process ABUSEIPDB_FAIL_OPEN
    if (failOpen !== null) {
      idToken.abuseIpdbFailOpen = failOpen === 'TRUE';
    } else {
      console.warn('ABUSEIPDB_FAIL_OPEN environment variable not found.');
      idToken.abuseIpdbFailOpen = null;
    }
  
    // Get the user's last known abuse score from properties
    if (kindeDomain && clientId && clientSecret) {
      console.log(`Attempting to get abuse score for user: ${event.context.user.id}`);
      const abuseScore = await getUserProperty(
        event.context.user.id,
        'abuseipdb_last_known_score',
        kindeDomain,
        clientId,
        clientSecret
      );
  
      console.log(`Retrieved abuse score from properties: "${abuseScore}"`);
  
      if (abuseScore) {
        const abuseScoreNumber = parseInt(abuseScore, 10);
        if (!isNaN(abuseScoreNumber) && abuseScoreNumber >= 0 && abuseScoreNumber <= 100) {
          idToken.abuseIpdbCurrentScore = abuseScoreNumber;
          console.log(`Successfully set abuse score in token: ${abuseScoreNumber}`);
        } else {
          console.warn(`Invalid abuse score from user properties: "${abuseScore}". Expected a number between 0-100.`);
          idToken.abuseIpdbCurrentScore = null;
        }
      } else {
        console.log('No abuse score found in user properties');
        idToken.abuseIpdbCurrentScore = null;
      }
    } else {
      console.warn('Missing Kinde Management API credentials. Cannot retrieve abuse score from user properties.');
      idToken.abuseIpdbCurrentScore = null;
    }
  } 