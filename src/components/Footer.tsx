import Link from "next/link";

const footerLinks = {
  Empresa: [
    { label: "Início", href: "/" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Serviços", href: "/servicos" },
    { label: "Contato", href: "/contato" },
  ],
  Serviços: [
    { label: "Soluções em TI", href: "/servicos" },
    { label: "Produção Musical", href: "/servicos/producao-musical" },
  ],
  Legal: [
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "LGPD", href: "#" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-900 bg-brand-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-3">
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
            <p className="mb-4 text-sm leading-relaxed text-brand-100/72">
              Consultoria em TI especializada em transformação digital. Seu
              parceiro estratégico em tecnologia.
            </p>
            <p className="text-xs text-brand-200/48">
              Rio de Janeiro, RJ — Brasil
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-100/68 transition-colors hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-900 pt-8 sm:flex-row">
          <p className="text-sm text-brand-200/48">
            © {currentYear} CPX Labs. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {[
              { label: "LinkedIn", href: "https://linkedin.com/company/cpxlabs" },
              { label: "GitHub", href: "https://github.com/cpxlabs" },
              { label: "Instagram", href: "https://instagram.com/cpxlabs" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-100/60 transition-colors hover:text-brand-300"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
