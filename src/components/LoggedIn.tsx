import React from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { LogoutLink, PortalLink } from "@kinde-oss/kinde-auth-react/components";

export default function LoggedIn() {
  const { user, getToken, getIdToken } = useKindeAuth();
  
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



  // State for token information
  const [tokenInfo, setTokenInfo] = React.useState<Record<string, unknown> | null>(null);
  const [isTokenExpanded, setIsTokenExpanded] = React.useState(false);
  const [rawToken, setRawToken] = React.useState<string | null>(null);
  const [tokenSearchTerm, setTokenSearchTerm] = React.useState<string>('');
  


  // Get token information on component mount
  React.useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Try to get ID token first
        let token = null;
        try {
          token = await getIdToken();
        } catch {
          token = await getToken();
        }
        
        if (token) {
          setRawToken(token);
          const decoded = decodeToken(token);
          setTokenInfo(decoded);
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };
    fetchTokenData();
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
                  {tokenInfo && (
                    <>
                      <p><strong>Email verified:</strong> {tokenInfo.email_verified ? 'Yes' : 'No'}</p>
                      <p><strong>Abuse IPDB block threshold:</strong> {String(tokenInfo.abuseIpdbBlockThreshold || 'Not set')}</p>
                      <p><strong>Abuse IPDB current score:</strong> {tokenInfo.abuseIpdbCurrentScore !== undefined && tokenInfo.abuseIpdbCurrentScore !== null ? String(tokenInfo.abuseIpdbCurrentScore) : 'Not set'}</p>
                      <p><strong>Auth time:</strong> {tokenInfo.auth_time ? new Date(Number(tokenInfo.auth_time) * 1000).toLocaleString() : 'Not set'}</p>
                      <p><strong>Token expiration:</strong> {tokenInfo.exp ? new Date(Number(tokenInfo.exp) * 1000).toLocaleString() : 'Not set'}</p>
                      <p><strong>Org code:</strong> {Array.isArray(tokenInfo.org_codes) ? tokenInfo.org_codes.join(', ') : 'Not set'}</p>
                      <p><strong>User ID:</strong> {String(tokenInfo.sub || 'Not set')}</p>
                    </>
                  )}
                  
                         {tokenInfo && (
                           <>
                             <hr style={{ margin: '20px 0', border: '1px solid rgba(255,255,255,0.1)' }} />
                             <div className="token-section">
                               <button
                                 className="token-toggle-btn"
                                 onClick={() => setIsTokenExpanded(!isTokenExpanded)}
                                 style={{
                                   background: 'none',
                                   border: '1px solid rgba(255,255,255,0.3)',
                                   color: 'white',
                                   padding: '10px 15px',
                                   borderRadius: '8px',
                                   cursor: 'pointer',
                                   fontSize: '14px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: '8px',
                                   marginBottom: '15px'
                                 }}
                               >
                                 <span>{isTokenExpanded ? '▼' : '▶'}</span>
                                 {isTokenExpanded ? 'Hide' : 'Show'} Full ID Token
                               </button>

                               
                               {isTokenExpanded && (
                                 <div className="token-content" style={{ marginBottom: '20px' }}>
                                   <div className="token-tabs" style={{ display: 'flex', marginBottom: '10px', gap: '10px', alignItems: 'center' }}>
                                     <button
                                       className="token-tab active"
                                       style={{
                                         background: 'rgba(255,255,255,0.1)',
                                         border: 'none',
                                         color: 'white',
                                         padding: '8px 16px',
                                         borderRadius: '6px 6px 0 0',
                                         cursor: 'pointer',
                                         fontSize: '13px'
                                       }}
                                     >
                                       Decoded Token
                                     </button>
                                     <input
                                       type="text"
                                       placeholder="Search token fields (e.g., abuseIpdbBlockThreshold)"
                                       value={tokenSearchTerm}
                                       onChange={(e) => setTokenSearchTerm(e.target.value)}
                                       style={{
                                         background: 'rgba(255,255,255,0.1)',
                                         border: '1px solid rgba(255,255,255,0.3)',
                                         color: 'white',
                                         padding: '6px 12px',
                                         borderRadius: '4px',
                                         fontSize: '12px',
                                         flex: 1,
                                         maxWidth: '300px'
                                       }}
                                     />
                                   </div>
                                   
                                   <div className="token-display" style={{
                                     background: 'rgba(0,0,0,0.3)',
                                     border: '1px solid rgba(255,255,255,0.2)',
                                     borderRadius: '0 6px 6px 6px',
                                     padding: '15px',
                                     maxHeight: '400px',
                                     overflow: 'auto'
                                   }}>
                                     <div style={{ marginBottom: '10px', color: '#a8e6cf', fontSize: '12px' }}>
                                       <strong>Total fields in token: {Object.keys(tokenInfo || {}).length}</strong>
                                       {tokenSearchTerm && (
                                         <span style={{ marginLeft: '10px', color: '#ffb366' }}>
                                           (Filtered: {Object.keys(tokenInfo || {}).filter(key => 
                                             key.toLowerCase().includes(tokenSearchTerm.toLowerCase())
                                           ).length} matches)
                                         </span>
                                       )}
                                     </div>
                                     <pre style={{
                                       color: 'white',
                                       fontSize: '12px',
                                       lineHeight: '1.4',
                                       margin: 0,
                                       whiteSpace: 'pre-wrap',
                                       wordBreak: 'break-word'
                                     }}>
                                       {tokenSearchTerm 
                                         ? JSON.stringify(
                                             Object.fromEntries(
                                               Object.entries(tokenInfo || {}).filter(([key]) => 
                                                 key.toLowerCase().includes(tokenSearchTerm.toLowerCase())
                                               )
                                             ), 
                                             null, 
                                             2
                                           )
                                         : JSON.stringify(tokenInfo, null, 2)
                                       }
                                     </pre>
                                   </div>
                                   
                                   {rawToken && (
                                     <div style={{ marginTop: '15px' }}>
                                       <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>Raw Token:</h4>
                                       <div style={{
                                         background: 'rgba(0,0,0,0.3)',
                                         border: '1px solid rgba(255,255,255,0.2)',
                                         borderRadius: '6px',
                                         padding: '10px',
                                         maxHeight: '100px',
                                         overflow: 'auto'
                                       }}>
                                         <code style={{
                                           color: '#a8e6cf',
                                           fontSize: '11px',
                                           wordBreak: 'break-all'
                                         }}>
                                           {rawToken}
                                         </code>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               )}
                               
                               
                             </div>
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
                Workflow code
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
