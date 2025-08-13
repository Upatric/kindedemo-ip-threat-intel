import {
  RegisterLink,
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
            <RegisterLink className="btn btn-primary">Get started</RegisterLink>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="modern-main">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span>Secure authentication demo</span>
            </div>
            
            <h1 className="hero-title">
              Advanced authentication with
              <span className="gradient-text"> threat intelligence</span>
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
            <a
                  href="https://docs.kinde.com/workflows/about-workflows/"
                  target="_blank"
                  rel="noreferrer"
                  className="feature-link"
                >
                  Learn about workflows →
                </a>
              </div>
            </div>

            <div className="cta-section">
                              <a
                  href="https://dev.to/kinde/creating-a-kinde-workflow-to-check-for-malicious-ips-3pmk"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-large"
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
