import React from 'react'
import { LayoutGrid } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        {/* Left: Logo */}
        <a href="/" className="footer__logo" aria-label="SmartHire AI Home">
          <span className="footer__logo-icon" aria-hidden="true">
            <LayoutGrid size={14} strokeWidth={2.5} color="#fff" />
          </span>
          <span className="footer__logo-text">SmartHire AI</span>
        </a>

        {/* Center: Copyright */}
        <p className="footer__copy">
          © 2026 SmartHire AI. All rights reserved.
        </p>

        {/* Right: Links */}
        <nav className="footer__links" aria-label="Footer navigation">
          <a href="#privacy"  className="footer__link" id="footer-privacy">Privacy Policy</a>
          <a href="#terms"    className="footer__link" id="footer-terms">Terms of Service</a>
          <a href="#contact"  className="footer__link" id="footer-contact">Contact Support</a>
        </nav>
      </div>
    </footer>
  )
}
