import React from 'react';

import './GlobalComponent.css'

function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <a className="font-display text-xl font-bold gradient-text" href="/">
            DevPortfolio
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-medium transition-colors duration-200 hover:text-primary text-primary"
              href="/"
            >
              Home
              <div
                className="h-0.5 gradient-bg mt-1 rounded-full"
                style={{ opacity: 1 }}
              ></div>
            </a>

            <a
              className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground"
              href="/projects"
            >
              Projects
            </a>

            <a
              className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground"
              href="/services"
            >
              Services
            </a>

            <a
              className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground"
              href="/payment"
            >
              Payment
            </a>

            <a
              className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground"
              href="/contact"
            >
              Contact
            </a>

            <a
              className="gradient-bg px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              href="/contact"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>

        </div>
      </nav>
    </>
  );
}

export default Navbar;