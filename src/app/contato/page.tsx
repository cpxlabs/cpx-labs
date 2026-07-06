import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: "📧",
    title: "E-mail",
    value: "contato.cpxlabs@gmail.com",
    href: "mailto:contato.cpxlabs@gmail.com",
  },
  {
    icon: "📞",
    title: "Telefone / WhatsApp",
    value: "(21) 97554-2783",
    href: "https://wa.me/5521975542783",
  },
  {
    icon: "📍",
    title: "Localização",
    value: "Rio de Janeiro, RJ — Ramos, Complexo do Alemão",
    href: "https://maps.google.com/?q=Ramos+Complexo+do+Alemão+Rio+de+Janeiro+RJ",
  },
  {
    icon: "⏰",
    title: "Horário de Atendimento",
    value: "Seg–Sex: 09h às 18h",
    href: null,
  },
];

export default function ContatoPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-16">
          <span className="mb-4 inline-block rounded-full border border-brand-400/30 bg-brand-500/12 px-4 py-1.5 text-sm font-semibold text-brand-100">
            Entre em contato
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Vamos conversar sobre o seu projeto
          </h1>
          <p className="text-brand-100/72 text-lg max-w-2xl mx-auto">
            Preencha o formulário ou utilize nossos canais de contato. Nossa
            equipe responde em até 24 horas úteis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-brand-800 bg-brand-900/60 p-5 transition-all duration-300 hover:border-brand-600 hover:bg-brand-900/80"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="text-sm text-brand-100/68">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-semibold text-white transition-colors hover:text-brand-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-brand-800 bg-brand-900/60 p-5">
              <p className="mb-3 text-sm text-brand-100/68">Redes Sociais</p>
              <div className="flex gap-3">
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
                    className="rounded-full bg-brand-800 px-3 py-1.5 text-sm font-medium text-brand-100/82 transition-all hover:bg-brand-500 hover:text-white"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-800 bg-brand-900/60 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
