import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - Planpost</title>
      </Head>

      <header className="ps-header-wrapper">
        <div className="container">
          <div className="ps-header-flex">
            <div className="ps-logo">
              <Link href="/">
                <img src="/assets/images/Logo.png" alt="Planpost" />
              </Link>
            </div>
            <nav className="ps-menu">
              <ul>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/plans">Plans</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </nav>
            <div className="ps-header-btn">
              <Link href="/login" className="login-btn">LOGIN</Link>
              <Link href="/#plans" className="buy-btn">BUY NOW</Link>
            </div>
          </div>
        </div>
      </header>

      <style jsx global>{`
        .ps-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .ps-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ps-logo img {
          height: 40px;
          width: auto;
        }

        .ps-menu ul {
          display: flex;
          gap: 48px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .ps-menu ul li a {
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          transition: color 0.3s;
        }

        .ps-menu ul li a:hover {
          color: #6366f1;
        }

        .ps-header-btn {
          display: flex;
          gap: 16px;
        }

        .login-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          color: #fff;
          background: #6366f1;
          border: none;
          transition: all 0.3s;
        }

        .buy-btn {
          display: inline-flex;
          align-items: center;
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          color: #fff;
          background: #6366f1;
          border: none;
          transition: all 0.3s;
        }

        .login-btn:hover, .buy-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .ps-menu {
            display: none;
          }
          
          .ps-header-btn {
            gap: 8px;
          }
          
          .login-btn, .buy-btn {
            padding: 6px 16px;
            font-size: 14px;
          }
        }
      `}</style>

      <style jsx global>{`
        .ps-terms-wrapper {
          background: #0D0D14;
          min-height: 100vh;
          padding: 120px 0 80px;
          color: #94A3B8;
          position: relative;
          overflow: hidden;
        }
        
        .ps-terms-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 0%, rgba(99, 102, 241, 0.15), transparent 50%);
          pointer-events: none;
        }

        .ps-terms-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 80% 100%, rgba(139, 92, 246, 0.15), transparent 50%);
          pointer-events: none;
        }

        .ps-terms-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
          margin-top: 50px;
        }

        .ps-terms-heading {
          text-align: center;
          margin-bottom: 60px;
        }

        .ps-terms-heading h4 {
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .ps-terms-heading h1 {
          font-size: 48px;
          background: linear-gradient(135deg, #fff 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .ps-terms-content {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 40px;
        }

        .ps-terms-content h2 {
          color: #fff;
          font-size: 24px;
          margin: 32px 0 16px;
        }

        .ps-terms-content p {
          margin-bottom: 16px;
          line-height: 1.7;
        }

        .ps-terms-content ul {
          margin: 16px 0;
          padding-left: 24px;
        }

        .ps-terms-content li {
          margin-bottom: 8px;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .ps-terms-wrapper {
            padding: 100px 0 60px;
          }
          
          .ps-terms-heading h1 {
            font-size: 36px;
          }
          
          .ps-terms-content {
            padding: 24px;
          }
        }

        /* Footer Styles */
        .ps-footer-wrapper {
          background: #0D0D14;
          padding: 80px 0 40px;
          color: #94A3B8;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .ps-footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 30px;
        }

        .ps-footer-logo {
          margin-bottom: 20px;
        }

        .ps-footer-desc {
          max-width: 320px;
          margin-bottom: 30px;
          line-height: 1.7;
        }

        .ps-footer-heading {
          color: #fff;
          font-size: 18px;
          margin-bottom: 24px;
        }

        .ps-footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ps-footer-links a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.3s;
        }

        .ps-footer-links a:hover {
          color: #6366f1;
        }

        .ps-footer-newsletter {
          margin-bottom: 30px;
        }

        .ps-footer-email {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          margin-bottom: 12px;
        }

        .ps-footer-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .ps-footer-submit:hover {
          opacity: 0.9;
        }

        .ps-footer-social {
          display: flex;
          gap: 16px;
        }

        .ps-footer-social a {
          color: #94A3B8;
          transition: color 0.3s;
        }

        .ps-footer-social a:hover {
          color: #6366f1;
        }

        @media (max-width: 768px) {
          .ps-footer-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .ps-footer-desc {
            margin: 0 auto 30px;
          }

          .ps-footer-social {
            justify-content: center;
          }
        }
      `}</style>

      <main className="ps-terms-wrapper">
        <div className="ps-terms-container">
          <div className="ps-terms-heading">
            <h4>Terms & Conditions</h4>
            <h1>Our Service Agreement</h1>
          </div>
          
          <div className="ps-terms-content">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using PlanPost, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>

            <h2>Use of Services</h2>
            <p>When using our services, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in any unauthorized activities</li>
              <li>Not interfere with other users' access to the service</li>
            </ul>

            <h2>Account Registration</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Be at least 18 years old</li>
              <li>Register for an account with valid information</li>
              <li>Keep your login credentials secure</li>
              <li>Notify us of any unauthorized account use</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>All content and materials available on PlanPost are protected by intellectual property rights. You may not:</p>
            <ul>
              <li>Copy or reproduce any content without permission</li>
              <li>Modify or create derivative works</li>
              <li>Use our trademarks without authorization</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>PlanPost is provided "as is" without any warranties. We shall not be liable for any damages arising from:</p>
            <ul>
              <li>Use or inability to use our services</li>
              <li>Unauthorized access to your account</li>
              <li>Technical failures or interruptions</li>
              <li>Loss of data or content</li>
            </ul>

            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via:</p>
            <ul>
              <li>Email notification</li>
              <li>Notice on our website</li>
              <li>In-app notifications</li>
            </ul>

            <h2>Contact Information</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
            <p>Email: legal@PlanPost.com</p>
            <p>Address: 123 Social Avenue, Digital City, DC 12345</p>
          </div>
        </div>
      </main>

      <footer className="ps-footer-wrapper">
        <div className="ps-footer-container">
          <div>
            <div className="ps-footer-logo">
              <Image src="/assets/images/logo.png" alt="PlanPost" width={150} height={40} />
            </div>
            <p className="ps-footer-desc">
              Empower your social media presence with AI-driven content creation and management tools.
            </p>
          </div>

          <div>
            <h3 className="ps-footer-heading">Company</h3>
            <div className="ps-footer-links">
            <Link href="/login">Sign in</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            </div>
          </div>

          <div>
            <h3 className="ps-footer-heading">Newsletter</h3>
            <div className="ps-footer-newsletter">
              <input type="email" placeholder="Enter your email" className="ps-footer-email" />
              <button className="ps-footer-submit">Subscribe</button>
            </div>
            <div className="ps-footer-social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 