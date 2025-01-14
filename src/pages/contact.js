import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us - PlanPost</title>
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

      <main className="ps-contact-wrapper">
        <div className="ps-contact-container">
          <div className="ps-contact-heading">
            <h4>Contact Us</h4>
            <h1>Get in Touch</h1>
            <p>Have questions? We're here to help and provide the support you need.</p>
          </div>
          
          <div className="ps-contact-content">
            <div className="ps-contact-info">
              <div className="info-item">
                <div className="icon">📍</div>
                <h3>Our Location</h3>
                <p>123 Social Avenue<br />Digital City, DC 12345</p>
              </div>
              <div className="info-item">
                <div className="icon">📧</div>
                <h3>Email Us</h3>
                <p>support@planpost.com<br />info@planpost.com</p>
              </div>
              <div className="info-item">
                <div className="icon">📱</div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567<br />Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ps-contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </main>

      <footer className="ps-footer-wrapper">
        <div className="ps-footer-container">
          <div className="ps-footer-left">
            <div className="ps-footer-logo">
              <Link href="/">
                <img src={process.env.APP_LOGO} alt="Logo" />
              </Link>
            </div>
            <p className="ps-footer-description">
              Easily Schedule Your Social Media Posts With PlanPost.
            </p>
          </div>
          <div className="ps-footer-center">
            <div className="ps-footer-nav">
              <div className="ps-footer-nav-column">
                <h4>Company</h4>
                <div className="ps-footer-nav-links">
                  <Link href="/login">Sign in</Link>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                  <Link href="/terms">Terms & Conditions</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="ps-footer-right">
            <div className="ps-footer-newsletter">
              <input type="email" placeholder="Enter Your Email" className="ps-footer-email" />
              <button className="ps-footer-submit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="ps-footer-social">
              <Link href="#"><i className="fab fa-github"></i></Link>
              <Link href="#"><i className="fab fa-dribbble"></i></Link>
              <Link href="#"><i className="fab fa-facebook"></i></Link>
              <Link href="#"><i className="fab fa-twitter"></i></Link>
              <Link href="#"><i className="fab fa-instagram"></i></Link>
            </div>
          </div>
        </div>
        <div className="ps-footer-bottom">
          <div className="ps-copyright">
            <p>Copyright © 2023. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .ps-contact-wrapper {
          background: #0A0A0F;
          min-height: 100vh;
          padding: 120px 0 80px;
          color: #94A3B8;
          position: relative;
          overflow: hidden;
        }

        .ps-contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .ps-contact-heading {
          text-align: center;
          margin-bottom: 60px;
        }

        .ps-contact-heading h4 {
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .ps-contact-heading h1 {
          font-size: 48px;
          background: linear-gradient(135deg, #fff 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 16px;
        }

        .ps-contact-heading p {
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto;
        }

        .ps-contact-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 40px;
        }

        .ps-contact-info {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .info-item {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          transition: transform 0.3s;
        }

        .info-item:hover {
          transform: translateY(-5px);
        }

        .info-item .icon {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .info-item h3 {
          color: #fff;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .ps-contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #64748B;
        }

        .submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.3s;
          align-self: flex-start;
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .ps-contact-content {
            grid-template-columns: 1fr;
          }

          .ps-contact-heading h1 {
            font-size: 36px;
          }

          .submit-btn {
            align-self: stretch;
          }
        }

        .form-group input,
        .form-group textarea {
          color: #fff;
          font-size: 16px;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94A3B8;
        }

        .submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          padding: 12px 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        .ps-footer-wrapper {
          background: #0A0A0F;
          padding: 80px 0 40px;
          color: #94A3B8;
        }

        .ps-footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
        }

        .ps-footer-logo {
          margin-bottom: 24px;
        }

        .ps-footer-description {
          max-width: 300px;
        }

        .ps-footer-nav h4 {
          color: #fff;
          margin-bottom: 24px;
        }

        .ps-footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ps-footer-nav-links a {
          color: #94A3B8;
          transition: color 0.3s;
        }

        .ps-footer-nav-links a:hover {
          color: #fff;
        }

        .ps-footer-newsletter {
          position: relative;
          margin-bottom: 32px;
        }

        .ps-footer-email {
          width: 100%;
          padding: 12px 48px 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
        }

        .ps-footer-submit {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          transition: color 0.3s;
        }

        .ps-footer-submit:hover {
          color: #fff;
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
          color: #fff;
        }

        .ps-footer-bottom {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        @media (max-width: 768px) {
          .ps-contact-content {
            grid-template-columns: 1fr;
          }

          .ps-footer-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .ps-footer-description {
            max-width: none;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
} 