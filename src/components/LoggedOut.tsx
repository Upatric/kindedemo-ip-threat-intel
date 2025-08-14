import {
  LoginLink,
} from "@kinde-oss/kinde-auth-react/components";

export default function LoggedOut() {
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
          <div className="header-actions">
            <LoginLink className="btn btn-secondary">Sign in</LoginLink>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="modern-main">
        <div className="hero-section">
          <div className="hero-content">

            
            <h1 className="hero-title">
              Advanced authentication with
              <span className="gradient-text"> IP threat intelligence</span>
            </h1>
            
            <p className="hero-description">
              Experience next-generation authentication powered by Kinde workflows. 
              This demo showcases malicious IP detection using AbuseIPDB integration 
              and optimized performance with Upstash Redis caching.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>IP threat detection</h3>
                <p>Real-time malicious IP checking with AbuseIPDB</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Smart caching</h3>
                <p>Optimized performance with Upstash Redis caching</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔧</div>
                <h3>Custom workflows</h3>
                <p>Extensible authentication with Kinde workflows</p>
              </div>
            </div>

            <div className="cta-section">
              <h2 className="section-title">References</h2>
              
              <div className="cta-buttons">
                              <a
                  href="https://dev.to/kinde/creating-a-kinde-workflow-to-check-for-malicious-ips-3pmk"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
                >
                  Read article
                </a>
                
                <a
                  href="https://github.com/kinde-starter-kits/workflow-examples/blob/main/postUserAuthentication/checkIPWithAbuseIPDBWorkflow.ts"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
                >
                  Workflow examples
                </a>
                
                <a
                  href="https://docs.kinde.com/workflows/about-workflows/"
              target="_blank"
              rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  About workflows
            </a>
            
            <a
                  href="https://github.com/kinde-oss/kindedemo-ip-threat-intel"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  Code for this site
            </a>
            
            <a
                  href="https://docs.kinde.com/developer-tools/sdks/frontend/react-sdk/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  React SDK
            </a>
            
            <a
                  href="https://github.com/kinde-starter-kits/react-starter-kit"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  React starter kit
            </a>
            
            <a
                  href="https://abuseipdb.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  AbuseIPDB
            </a>
            
            <a
                  href="https://upstash.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
            >
                  Upstash
            </a>
              </div>
            </div>
            
            <div className="flow-section">
              <h2 className="section-title">Flow diagram</h2>
              <div className="flow-diagram-container">
                <pre className="flow-diagram">
{`┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    IP THREAT INTELLIGENCE AUTHENTICATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │   REACT     │    │   KINDE     │    │   WORKFLOWS │    │   EXTERNAL  │
│  BROWSER    │    │   FRONTEND  │    │   AUTH      │    │             │    │  SERVICES   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │ 1. Visit Site     │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 2. Click Sign In  │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │ 3. Redirect to    │                   │                   │
       │                   │    Kinde Auth     │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │ 4. User Login     │                   │                   │                   │
       │──────────────────────────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │ 5. Post Auth      │                   │
       │                   │                   │   Workflow        │                   │
       │                   │                   │──────────────────▶│                   │
       │                   │                   │                   │                   │
       │                   │                   │                   │ 6. Check Cache    │
       │                   │                   │                   │   (Upstash Redis) │
       │                   │                   │                   │◀─────────────────▶│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 7. If not         │
       │                   │                   │                   │   cached, call    │
       │                   │                   │                   │   AbuseIPDB       │
       │                   │                   │                   │◀─────────────────▶│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 8. Store score    │
       │                   │                   │                   │   in cache        │
       │                   │                   │                   │──────────────────▶│
       │                   │                   │                   │                   │
       │                   │                   │ 9. Store score    │                   │
       │                   │                   │   in user props   │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 10. Token Gen     │                   │
       │                   │                   │   Workflow        │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 11. Add abuse     │                   │
       │                   │                   │    score to ID    │                   │
       │                   │                   │    token claims   │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │ 12. Redirect back │                   │                   │
       │                   │    with token     │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │ 13. Display       │                   │                   │                   │
       │    user info &    │                   │                   │                   │
       │    token data     │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │`}
                </pre>
              </div>
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
              <a href="https://kinde.com/support/" className="footer-link">Support and community</a>
            </div>
          </div>
        </div>
        

      </footer>
    </div>
  );
}
