"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Digital art & Illustrations", href: "/digital-art" },
  { label: "Traditional art & Crafts", href: "/traditional-art" },
  { label: "Graphic Design", href: "/graphic-design" },
  { label: "Animation & Motion Graphic", href: "/animation" },
  { label: "About me", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDark = pathname !== "/";

  return (
    <nav className={`navbar ${isDark ? "dark-nav" : ""}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="logo-container">
          <span className={`site-logo ${isDark ? "!text-[#48ABBF]" : ""}`}>Naya Al-Khoury</span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`nav-link ${isDark ? "!text-white hover:!text-[#48ABBF]" : ""}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`hamburger-line ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`hamburger-line ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`hamburger-line ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul className="mobile-menu">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
