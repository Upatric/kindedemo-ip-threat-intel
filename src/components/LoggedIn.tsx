import React from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { LogoutLink, PortalLink } from "@kinde-oss/kinde-auth-react/components";

export default function LoggedIn() {
  const { user, getToken } = useKindeAuth();
  
  // Function to decode JWT token
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Get all token information
  const getTokenInfo = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decoded = decodeToken(token);
        return decoded;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return null;
  };

  // State for token information
  const [tokenInfo, setTokenInfo] = React.useState<Record<string, any> | null>(null);

  // Get token information on component mount
  React.useEffect(() => {
    getTokenInfo().then(setTokenInfo);
  }, []);

  return (
    <div className="modern-login-container">
      {/* Background with gradient */}
      <div className="background-gradient"></div>
      
      {/* Floating shapes for visual interest */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header */}
      <header className="modern-header">
        <div className="header-content">
          <div className="brand-section">
            <a href="https://kinde.com" target="_blank" rel="noreferrer" className="brand-link">
              <div className="brand-image">
                <img src="/kinde-logo.png" alt="Kinde" className="brand-img" />
              </div>
            </a>
          </div>
          <div className="profile-blob">
            {user?.picture !== "" ? (
              <img
                className="avatar"
                src={user?.picture}
                alt="user profile avatar"
              />
            ) : (
              <div className="avatar">
                {user?.givenName?.[0]}
                {user?.familyName?.[1]}
              </div>
            )}
            <div>
              <p className="text-heading-2">
                {user?.givenName} {user?.familyName}
              </p>
              <ul className="c-user-menu">
                <li>
                  <PortalLink>Account</PortalLink>
                </li>
                <li>
                  <LogoutLink className="text-subtle">Sign out</LogoutLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="modern-main">
        <div className="hero-section">
          <div className="hero-content">

            {/* User Information Section */}
            <div className="user-info-section">
              <h2 className="section-title">Your authentication details</h2>
              <div className="info-card">
                <div className="info-content">
                  <p><strong>Name:</strong> {user?.givenName} {user?.familyName}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  {user?.picture && (
                    <p><strong>Profile picture:</strong> Available</p>
                  )}
                  
                                           {tokenInfo && (
                           <>
                             <hr style={{ margin: '20px 0', border: '1px solid rgba(255,255,255,0.1)' }} />
                             <h3 style={{ color: 'white', marginBottom: '15px' }}>Token information:</h3>
                             {Object.entries(tokenInfo).map(([key, value]) => (
                               <p key={key}>
                                 <strong>{key}:</strong> {
                                   key === 'iat' || key === 'exp'
                                     ? new Date(Number(value) * 1000).toLocaleString()
                                     : typeof value === 'object'
                                       ? JSON.stringify(value)
                                       : String(value)
                                 }
                               </p>
                             ))}
                             
                             {/* Environment Variables Section */}
                             {tokenInfo.abuseipdb_threshold && (
                               <>
                                 <hr style={{ margin: '20px 0', border: '1px solid rgba(255,255,255,0.1)' }} />
                                 <h3 style={{ color: 'white', marginBottom: '15px' }}>AbuseIPDB Configuration:</h3>
                                 <p><strong>Block threshold:</strong> {tokenInfo.abuseipdb_threshold}%</p>
                                 <p><strong>Cache expiry:</strong> {tokenInfo.abuseipdb_cache_expiry} seconds</p>
                                 <p><strong>Fail open:</strong> {tokenInfo.abuseipdb_fail_open ? 'Enabled' : 'Disabled'}</p>
                                 <p><strong>Config timestamp:</strong> {tokenInfo.abuseipdb_config_timestamp ? new Date(tokenInfo.abuseipdb_config_timestamp).toLocaleString() : 'N/A'}</p>
                               </>
                             )}
                           </>
                         )}
                </div>
              </div>
            </div>



            <div className="cta-section">
              <a
                href="https://dev.to/kinde/creating-a-kinde-workflow-to-check-for-malicious-ips-3pmk"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-large"
              >
                Read the article
              </a>
              
              <a
                href="https://github.com/kinde-starter-kits/workflow-examples/blob/main/postUserAuthentication/checkIPWithAbuseIPDBWorkflow.ts"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-large"
              >
                View source code
              </a>
              
              <a
                href="https://docs.kinde.com/workflows/about-workflows/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-large"
              >
                About workflows
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-section footer-resources">
            <div className="footer-links-row">
              <a href="https://kinde.com/docs" className="footer-link">Documentation</a>
              <a href="https://kinde.com/docs/developer-tools/react-sdk" className="footer-link">React SDK</a>
              <a href="https://kinde.com/support/" className="footer-link">Support and community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
