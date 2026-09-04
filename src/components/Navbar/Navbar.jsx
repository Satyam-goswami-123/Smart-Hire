import React, { useState, useEffect } from 'react'
import { LayoutGrid } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = ['Features', 'How it Works', 'Pricing']

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="SmartHire AI Home">
          <span className="navbar__logo-icon" aria-hidden="true">
            <LayoutGrid size={18} strokeWidth={2.5} color="#fff" />
          </span>
          <span className="navbar__logo-text">SmartHire AI</span>
        </a>

        {/* Center nav links */}
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className={`navbar__link ${activeLink === link ? 'navbar__link--active' : ''}`}
                onClick={() => { setActiveLink(link); setMenuOpen(false) }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="navbar__actions">
          <a href="#login" className="navbar__login" id="nav-login">Log In</a>
          <button 
            className="navbar__cta" 
            id="nav-get-started"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
