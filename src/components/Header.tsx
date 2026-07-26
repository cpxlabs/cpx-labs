"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 after:ease-out-expo ${
                    isActive
                      ? "text-brand-300 after:w-full after:bg-brand-400"
                      : "text-brand-100/80 hover:text-brand-300 after:w-0 after:bg-brand-400 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
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
          className={`md:hidden overflow-hidden transition-all duration-400 ease-out-expo ${
            menuOpen
              ? "max-h-80 opacity-100 pb-4"
              : "max-h-0 opacity-0 pb-0"
          }`}
        >
          <div className="border-t border-brand-800 pt-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
            })}
            <div className="px-4 pt-2">
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
