import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: "📧",
    title: "Email",
    value: "contato.cpxlabs@gmail.com",
    subtitle: "Retorno em até 24h",
    href: "mailto:contato.cpxlabs@gmail.com",
  },
  {
    icon: "📞",
    title: "Telefone",
    value: "(21) 97554-2783",
    subtitle: "WhatsApp disponível",
    href: "https://wa.me/5521975542783",
  },
  {
    icon: "📍",
    title: "Sede",
    value: "Rio de Janeiro, RJ — Ramos, Complexo do Alemão",
    subtitle: "Visitas com agendamento",
    href: "https://maps.google.com/?q=Ramos+Complexo+do+Alemão+Rio+de+Janeiro+RJ",
  },
];

export default function ContatoPage() {
  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Entre em Contato
          </h1>
          <p className="text-brand-100/70 text-lg max-w-2xl mx-auto">
            Estamos prontos para transformar sua ideia em realidade. Fale com nossos consultores.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h2>
            <ContactForm />
          </div>

          {/* Right Column: Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-5 rounded-3xl border border-brand-900 bg-brand-900/10 p-6 hover:border-brand-700 transition-all duration-350"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-medium text-brand-300 transition-colors hover:text-brand-200 text-sm sm:text-base break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-brand-300 font-medium text-sm sm:text-base">{item.value}</p>
                  )}
                  <p className="text-xs text-brand-200/50 mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
