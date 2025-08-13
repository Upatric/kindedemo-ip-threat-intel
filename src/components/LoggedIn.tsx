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
      const decoded = JSON.parse(jsonPayload);
      console.log('Full decoded token:', decoded);
      return decoded;
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
  
  // Function to manually decode the provided token
  const decodeProvidedToken = () => {
    const providedToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwOjA1OjJlOjEzOmI0OmI1OmI5OmUyOmQzOjc0OmMzOmNhOjZlOjUzOmM0OjhlIiwidHlwIjoiSldUIn0.eyJhYnVzZUlwZGJCbG9ja1RocmVzaG9sZCI6OTAsImF0X2hhc2giOiJzT1VWcTBIZG1TV3EtU2d6UjY4aGp3IiwiYXVkIjpbImJmNDM2MjJlZmM4NzQ5YzBiYjRjMzQyMWJiODQ4NTI5Il0sImF1dGhfdGltZSI6MTc1NTA1ODcwMywiYXpwIjoiYmY0MzYyMmVmYzg3NDljMGJiNGMzNDIxYmI4NDg1MjkiLCJlbWFpbCI6ImFsZXhAa2luZGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV4cCI6MTc1NTA2MjMwMywiZmFtaWx5X25hbWUiOiJOb3JtYW4iLCJnaXZlbl9uYW1lIjoiQWxleCIsImlhdCI6MTc1NTA1ODcwMywiaXNzIjoiaHR0cHM6Ly9raW5kZXRlc3Rwcm9kZmFuLmtpbmRlLmNvbSIsImp0aSI6IjNmOWRkNjhlLTU5NmItNDYxNy05OTFlLWM3Y2FhODk1Y2Y0NyIsIm5hbWUiOiJBbGV4IE5vcm1hbiIsIm5vbmNlIjoiZmI4OTY0YWExNjY3Nzc0MyIsIm9yZ19jb2RlcyI6WyJvcmdfYjJiZTg2MTc2NTMiXSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BTFYtVWpVWUdkMDBjLWZDb3VjN25UNkkwbS1uNFZPUHRnTWlkRXFFQUliNGtyNTZQUHlFUjVqWWg3a2sxSFRWMUZDRGdiRHRPYWFienFJZ19KTmJ0MUxsRlRuNWJNTC1uQnU3QmM0OVdSajYzeWpEWWVHRUR6R1RRTFJ1eGxHbE9HRk9wenJRRWQzRWVmaUpCRFlCX0xDajgyeHNEWEV5UC05RTJsSDAzQ0lkMGl6Qko2TVRqQjBhekpyeEpjdENUSWpZQkYzZmUteFN2Zk1Ta3BFb3NaSTM4TldwTGRudEJVMFZkS1RKM2ptQlA1SFp5SXpudnVIN0o5MWpKNFAwdDItbUVPanJ3cGhsREQyVjZVWnRFTVM5cjZtTFJaTjgwTWkwd21hWnlpcXI2bnl6SWtCNGo3MUd3aXRoY2lKTmxiUGpTM3dhOHJIeHdodzBYQ3IzNVFZdmhNeENHZmY5Y1JTcDdOUnVVREVuLWRmQ3JtbkRaa0lPckpRX2VOejJvdExYWEdvVzBLZGJGNGJZVzIzRkdESGNyVFc4SzNJWktKWDNoSzZKYW9lWmo1MlNUeXpnUjNXMDlGVko3U0I5NlVKOWEzLVVRRGZqQlJxdDhPcDRfVlowWlJXVmVYcVJkZGc5Q2JjVXVxRTFBaHllVXNicktSazNrRDJJN3ExTTR4ODlBbWExcE1HVHZNSDN5VmY1RFpUOWhfVDc0QU1HdFhaaFVvUVJuX00yU195MTAyS2VSZk1lU1p0dEEwSi1zNHhHWGZuZnRMZkRaUGNUY0RRYzdwUmZfTmVuZGhmdGdEdUNWWWxpcXlvQTZOZUV1WUMyWHZYNnhWeHlfRjdISFZJX0lvQUg2TkZNbnJ1TzI3TVo0WkFBdzM4ZmhZX2d1WEd3cFBvMVljRnFWYlBBeVVWTTVMWTlRczJSWFV3V1hrZTNFYmd5RnI0NnBDd2xlUnRqVDNFZVBhMTFhYkVTWkc2eXFEb0dQZDh0R2RmQ2d4R2dNQjE4N3Q3bVVZRUdQLUk3R2xGWVFXOGp4eEwwVGRWa21CaFlGUHJRWld5ZHdWYi1nYk92UHFHUXBrRlljRzY3elB0MHphQTNSUi1pc3B4VkgtN3FOa2p3dFVZeGdMNE50UmVOZkdYTXVXMllhNllPcmxxc1FOM0lPRlRHMjJ5TjkwNGFvaGZEVDJXVVFuSWFUU0l2ek42Ny1DbHRoMWY2X1BpNFRSQVU4WFZJRkI0Q3pWZ2x4VHZtV3RHazdKc0ZHVnI3QXY3SE1Rb1FoZmJPUlVTRXZqdkE1aHB5T0RHRVVXaTQzTnFMMWxXa0ZlQXo9czk2LWMiLCJyYXQiOjE3NTUwNTg3MDMsInN1YiI6ImtwXzFjNDFkMDA2ZjljOTQ2OTc5YTAyNzc5ODU2YzkyYzhmIiwidXBkYXRlZF9hdCI6MS43NTUwNTg3MDNlKzA5fQ.NqV6XoDyvJoQg0ubTdPiVEuqBGZyC-tYd8hor4VO439Hw-be7hAKyp6tOnsXTjmVrlUGdJWeDSacGyzcnbDw9Ith75pro40xxCG34YbydImsuc13-ruzJs0Mge5HjKylHandNP6m48U3CHjv73CiaxhL7WNyR1HRoMGUKcLBgB8MESH0ixjzQmjDrcADAVU5IzGW8jvewctHL7yC9kZYFSn6TchI2Yo_9Iy9nKX889I1C7Fu64EYiJNuwgDbk6jpckSA24WmmyVVSkrr5myDDnEIBeEL2lcwc5JPQwvh8H_QLrZFh2p4pN9bgmqpJRUxPsYHtHxKN7x6apDLozL6Qg";
    console.log('Manually decoding provided token...');
    setRawToken(providedToken);
    const decoded = decodeToken(providedToken);
    console.log('Manual decode result:', decoded);
    setTokenInfo(decoded);
  };

  // Get token information on component mount
  React.useEffect(() => {
    const fetchTokenData = async () => {
      try {
        console.log('Attempting to get ID token...');
        
        // Try to get ID token first
        let token = null;
        try {
          token = await getIdToken();
          console.log('Got ID token via getIdToken()');
        } catch {
          console.log('getIdToken() failed, trying getToken()...');
          token = await getToken();
          console.log('Got token via getToken()');
        }
        
        if (token) {
          console.log('Raw token received:', token.substring(0, 50) + '...');
          setRawToken(token);
          const decoded = decodeToken(token);
          console.log('Decoded token keys:', Object.keys(decoded || {}));
          setTokenInfo(decoded);
        } else {
          console.log('No token received');
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
                  {user?.picture && (
                    <p><strong>Profile picture:</strong> Available</p>
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
                               <button
                                 onClick={decodeProvidedToken}
                                 style={{
                                   background: 'rgba(255, 179, 102, 0.2)',
                                   border: '1px solid #ffb366',
                                   color: '#ffb366',
                                   padding: '8px 12px',
                                   borderRadius: '6px',
                                   cursor: 'pointer',
                                   fontSize: '12px',
                                   marginLeft: '10px'
                                 }}
                               >
                                 Test Provided Token
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
                               
                               <div className="token-summary">
                                 <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>Token Summary:</h3>
                                 {Object.entries(tokenInfo).map(([key, value]) => (
                                   <p key={key} style={{ 
                                     margin: '5px 0', 
                                     fontSize: '14px',
                                     backgroundColor: key === 'abuseIpdbBlockThreshold' ? 'rgba(255, 179, 102, 0.2)' : 'transparent',
                                     padding: key === 'abuseIpdbBlockThreshold' ? '8px' : '0',
                                     borderRadius: key === 'abuseIpdbBlockThreshold' ? '4px' : '0',
                                     border: key === 'abuseIpdbBlockThreshold' ? '1px solid #ffb366' : 'none'
                                   }}>
                                     <strong style={{ 
                                       color: key === 'abuseIpdbBlockThreshold' ? '#ffb366' : '#a8e6cf' 
                                     }}>{key}:</strong> {
                                       key === 'iat' || key === 'exp'
                                         ? new Date(Number(value) * 1000).toLocaleString()
                                         : typeof value === 'object'
                                           ? JSON.stringify(value)
                                           : String(value)
                                     }
                                   </p>
                                 ))}
                               </div>
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
