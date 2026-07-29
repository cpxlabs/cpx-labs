"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const navLinks: NavLink[] = [
  { label: "Início", href: "/" },
  {
    label: "Serviços",
    children: [
      { label: "Soluções em TI", href: "/servicos" },
      { label: "Produção Musical", href: "/servicos/producao-musical" },
    ],
  },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
    setMobileSubOpen(false);
  };

  const isChildActive = (children: { href: string }[]) =>
    children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const renderDesktopLink = (link: NavLink) => {
    if (link.children) {
      const active = isChildActive(link.children);
      return (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative text-sm font-medium transition-colors flex items-center gap-1 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 after:ease-out-expo ${
              active
                ? "text-brand-300 after:w-full after:bg-brand-400"
                : "text-brand-100/80 hover:text-brand-300 after:w-0 after:bg-brand-400 hover:after:w-full"
            }`}
          >
            {link.label}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-brand-800 bg-brand-950 shadow-xl shadow-brand-950/50 py-2 space-y-1">
              {link.children.map((child) => {
                const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      childActive
                        ? "text-brand-300 bg-brand-900/60"
                        : "text-brand-100/80 hover:text-brand-300 hover:bg-brand-900/60"
                    }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href!}
        className={`relative text-sm font-medium transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 after:ease-out-expo ${
          isActive
            ? "text-brand-300 after:w-full after:bg-brand-400"
            : "text-brand-100/80 hover:text-brand-300 after:w-0 after:bg-brand-400 hover:after:w-full"
        }`}
      >
        {link.label}
      </Link>
    );
  };

  const renderMobileLink = (link: NavLink) => {
    if (link.children) {
      const active = isChildActive(link.children);
      return (
        <div key={link.label}>
          <button
            onClick={() => setMobileSubOpen(!mobileSubOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
              active
                ? "text-brand-300 bg-brand-900/60"
                : "text-brand-100/80 hover:text-brand-300 hover:bg-brand-900/60"
            }`}
          >
            {link.label}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${mobileSubOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileSubOpen && (
            <div className="ml-4 space-y-1 pb-1">
              {link.children.map((child) => {
                const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={handleNavClick}
                    className={`block px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                      childActive
                        ? "text-brand-300 bg-brand-900/60"
                        : "text-brand-100/80 hover:text-brand-300 hover:bg-brand-900/60"
                    }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href!}
        onClick={handleNavClick}
        className={`block px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
          isActive
            ? "text-brand-300 bg-brand-900/60"
            : "text-brand-100/80 hover:text-brand-300 hover:bg-brand-900/60"
        }`}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${
        scrolled
          ? "bg-brand-950/95 backdrop-blur-sm shadow-lg shadow-brand-950/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="brand-logo-mark h-10 w-10" />
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
            {navLinks.map(renderDesktopLink)}
            <Link
              href="/contato"
              className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97]"
            >
              Fale Conosco
            </Link>
          </nav>

          <button
            className="md:hidden relative z-10 flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-brand-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-[2px] rounded-full bg-white transition-all duration-300 ease-out-expo origin-center ${
                menuOpen ? "translate-y-[3.5px] rotate-45 scale-x-90" : "mb-[5px]"
              }`}
            />
            <span
              className={`block w-5 h-[2px] rounded-full bg-white transition-all duration-300 ease-out-expo ${
                menuOpen ? "opacity-0 scale-x-0" : "mb-[5px]"
              }`}
            />
            <span
              className={`block w-5 h-[2px] rounded-full bg-white transition-all duration-300 ease-out-expo origin-center ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45 scale-x-90" : ""
              }`}
            />
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-out-expo rounded-2xl ${
            menuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 pb-0"
          }`}
        >
          <div className="border border-brand-800 bg-brand-950/98 backdrop-blur-sm rounded-2xl p-3 space-y-1 shadow-xl shadow-brand-950/50">
            {navLinks.map(renderMobileLink)}
            <div className="pt-2">
              <Link
                href="/contato"
                onClick={handleNavClick}
                className="block w-full bg-brand-500 hover:bg-brand-400 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-spring text-center active:scale-[0.97]"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
