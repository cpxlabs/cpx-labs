"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-950/95 backdrop-blur-sm shadow-lg shadow-brand-950/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="#inicio" className="flex items-center gap-3 group">
            <div className="brand-logo-mark h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex items-baseline gap-2 text-white">
              <span className="text-base font-semibold uppercase tracking-[0.32em] text-brand-300">
                CPX
              </span>
              <span className="text-xl font-bold uppercase tracking-[0.28em]">
                Labs
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-100/80 hover:text-brand-300 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contato"
              className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all brand-glow"
            >
              Fale Conosco
            </Link>
          </nav>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-white transition-all" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-brand-950/95 border-t border-brand-800 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="block px-4 py-3 text-brand-100/80 hover:text-brand-300 hover:bg-brand-900 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="#contato"
                onClick={handleNavClick}
                className="block w-full bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors text-center"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
