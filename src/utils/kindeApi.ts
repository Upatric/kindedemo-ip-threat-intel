// Kinde Management API utility for fetching environment variables
export async function getKindeEnvironmentVariables() {
  try {
    // Get M2M token
    const tokenResponse = await fetch('https://kindetestprodfan.kinde.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: import.meta.env.VITE_KINDE_M2M_CLIENT_ID,
        client_secret: import.meta.env.VITE_KINDE_M2M_CLIENT_SECRET,
        scope: 'environment:read'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get M2M token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Call Kinde Management API to get environment variables
    const configResponse = await fetch('https://kindetestprodfan.kinde.com/api/v1/environment/variables', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!configResponse.ok) {
      throw new Error('Failed to fetch environment variables');
    }

    const configData = await configResponse.json();
    
    // Filter for AbuseIPDB variables
    const abuseipdbVars = configData.filter((variable: any) => 
      variable.key.startsWith('ABUSEIPDB_')
    );

    return {
      success: true,
      config: abuseipdbVars
    };

  } catch (error) {
    console.error('Error fetching Kinde environment variables:', error);
    return {
      success: false,
      error: 'Failed to fetch environment variables'
    };
  }
} 