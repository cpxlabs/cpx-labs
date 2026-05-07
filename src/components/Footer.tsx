import Link from "next/link";

const footerLinks = {
  Empresa: [
    { label: "Quem Somos", href: "#quem-somos" },
    { label: "Serviços", href: "#servicos" },
    { label: "Contato", href: "#contato" },
  ],
  Serviços: [
    { label: "Desenvolvimento de Software", href: "#servicos" },
    { label: "Cloud & Infraestrutura", href: "#servicos" },
    { label: "Segurança da Informação", href: "#servicos" },
    { label: "Business Intelligence", href: "#servicos" },
    { label: "Inteligência Artificial", href: "#servicos" },
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
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="#inicio" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                CPX
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Labs
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Consultoria em TI especializada em transformação digital. Seu
              parceiro estratégico em tecnologia.
            </p>
            <p className="text-slate-500 text-xs">
              CNPJ: 00.000.000/0001-00
              <br />
              São Paulo, SP — Brasil
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-sky-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
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
                className="text-slate-500 hover:text-sky-400 text-sm transition-colors"
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
