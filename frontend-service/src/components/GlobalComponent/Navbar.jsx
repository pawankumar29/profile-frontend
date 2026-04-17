import React from 'react';
import { Link, NavLink } from "react-router-dom";

import './GlobalComponent.css'

function Navbar() {
  const navItemClass = ({ isActive }) =>
    [
      "group text-sm font-medium transition-colors duration-200 hover:text-primary",
      isActive ? "text-primary" : "text-muted-foreground",
    ].join(" ");

  const underlineClass = (isActive) =>
    [
      "h-0.5 gradient-bg mt-1 rounded-full transition-opacity duration-200",
      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
    ].join(" ");

  const NavItem = ({ to, end = false, children }) => (
    <NavLink className={navItemClass} to={to} end={end}>
      {({ isActive }) => (
        <>
          <span>{children}</span>
          <div className={underlineClass(isActive)}></div>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link className="font-display text-xl font-bold gradient-text" to="/">
            DevPortfolio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/projects">Projects</NavItem>
            <NavItem to="/payment">Payment</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <NavLink
              className={() =>
                "gradient-bg px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              }
              to="/contact"
            >
              Hire Me
            </NavLink>
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
