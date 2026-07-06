import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";

export default function HomePage() {
  return (
    <div className="bg-brand-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 h-[24rem] w-[24rem] rounded-full bg-brand-500/20 blur-3xl animate-pulse-subtle" />
          <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-700/24 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/3 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-400/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: "2s" }} />
          <ThreeScene containerClassName="absolute right-10 top-1/2 -translate-y-1/2 w-[450px] h-[450px] hidden lg:block opacity-60" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center lg:text-left z-10">
          <div className="lg:max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
              Engenharia de Precisão para{" "}
              <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                Transformação Digital
              </span>
            </h1>

            <p className="text-brand-100/70 text-lg sm:text-xl max-w-2xl lg:mx-0 mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              Custom software development, Cloud intelligence, AI solutions, Cybersecurity and Strategic IT Consulting for high-impact results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <Link
                href="/servicos"
                className="rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-brand-400 brand-glow active:scale-[0.97]"
              >
                Começar
              </Link>
              <Link
                href="/contato"
                className="rounded-full border border-brand-700 px-8 py-4 text-base font-semibold text-brand-100 transition-all duration-300 hover:border-brand-400 hover:bg-brand-900/60 active:scale-[0.97]"
              >
                Falar com Consultor &rarr;
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mt-12 animate-fade-in-up" style={{ animationDelay: "450ms" }}>
              {[
                { number: "50+", label: "Projetos Entregues" },
                { number: "98%", label: "Taxa de Sucesso (NPS Fiel)" },
                { number: "10+", label: "Anos de Experiência" },
              ].map((stat) => (
                <div key={stat.label} className="border border-brand-800/40 bg-brand-900/30 backdrop-blur-sm rounded-2xl p-5 hover:border-brand-700/60 transition-all duration-350">
                  <p className="text-3xl font-extrabold text-brand-300">{stat.number}</p>
                  <p className="mt-1 text-xs text-brand-200/70 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Especializados de TI Section */}
      <section className="py-24 border-t border-brand-900/40 bg-brand-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Serviços Especializados de TI
            </h2>
            <p className="text-brand-100/60 text-lg max-w-xl mx-auto">
              Arquitetura e desenvolvimento digital sob medida para você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "Desenvolvimento de Software",
                desc: "Criamos aplicações web, mobile e desktop sob medida, utilizando as tecnologias mais modernas e adequadas.",
                tags: ["React", "Node.js"]
              },
              {
                icon: "☁️",
                title: "Computação em Nuvem",
                desc: "Migração, arquitetura e gerenciamento de ambientes em nuvem com foco em escalabilidade e redução de custos.",
                tags: ["AWS", "Azure"]
              },
              {
                icon: "🔒",
                title: "Cibersegurança",
                desc: "Protegemos os ativos digitais da sua empresa com análises de vulnerabilidade, conformidade e políticas.",
                tags: ["SOC", "Compliance"]
              },
              {
                icon: "📊",
                title: "Business Intelligence",
                desc: "Transformamos dados em insights estratégicos com dashboards, analytics avançado e soluções de Big Data.",
                tags: ["Power BI", "ETL"]
              },
              {
                icon: "🤖",
                title: "Inteligência Artificial",
                desc: "Implementamos soluções de IA e automação para aumentar a produtividade e competitividade do seu negócio.",
                tags: ["Python", "APIs"]
              },
              {
                icon: "🧩",
                title: "Consultoria Estratégica de TI",
                desc: "Orientamos sua equipe técnica e liderança com melhores práticas, arquitetura de sistemas e gestão ágil.",
                tags: ["CTO as a Service", "Agile"]
              }
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-3xl border border-brand-900 bg-brand-900/20 p-8 hover:-translate-y-1 hover:border-brand-700/60 hover:bg-brand-900/40 transition-all duration-350"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl group-hover:scale-105 transition-all">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-brand-100/60 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
                <div className="flex gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-brand-800/50 text-brand-300 border border-brand-700/30 rounded-full px-3 py-1 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quem Somos Section */}
      <section className="py-24 border-t border-brand-900/40 bg-brand-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-400 text-sm font-semibold tracking-widest uppercase block mb-3">
                História e Valores
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                Quem Somos
              </h2>
              <p className="text-brand-100/70 text-lg leading-relaxed mb-8">
                Nossa missão é impulsionar negócios através de soluções tecnológicas avançadas, garantindo inovação, segurança e eficiência operacional.
              </p>
              <div className="space-y-5">
                {[
                  {
                    title: "Inovação",
                    desc: "Soluções modernas e disruptivas."
                  },
                  {
                    title: "Integridade",
                    desc: "Parceria de longo prazo baseada em confiança."
                  },
                  {
                    title: "Qualidade",
                    desc: "Código limpo e arquitetura escalável."
                  }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-base">{item.title}</h4>
                      <p className="text-brand-200/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Mockup Graphic representation of technology stack / architecture */}
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-brand-800 bg-brand-900/20 backdrop-blur-sm p-6 flex flex-col justify-between group hover:border-brand-700 transition-all duration-350">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-brand-800 pb-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-brand-400 font-mono">cpx-labs-dashboard.json</span>
              </div>
              <div className="flex-1 flex flex-col justify-center py-6 font-mono text-xs text-brand-300 space-y-4">
                <div className="bg-brand-950/60 border border-brand-800/40 p-4 rounded-xl">
                  <span className="text-brand-400">const</span> cpxLabs = &#123;
                  <div className="pl-4">
                    mission: <span className="text-green-400">"Transformação Digital"</span>,
                    focus: [<span className="text-green-400">"IA"</span>, <span className="text-green-400">"Cloud"</span>, <span className="text-green-400">"Security"</span>],
                    quality: <span className="text-brand-400">true</span>
                  </div>
                  &#125;;
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-2 rounded bg-brand-700/40 w-full" />
                  <div className="h-2 rounded bg-brand-600/40 w-1/2" />
                  <div className="h-2 rounded bg-brand-800/40 w-3/4" />
                </div>
              </div>
              <div className="border-t border-brand-800 pt-4 flex justify-between items-center text-xs text-brand-400">
                <span>Architecture Verified</span>
                <span className="text-green-400">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entre em Contato Section */}
      <section className="py-20 border-t border-brand-900/40 bg-brand-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Entre em Contato
          </h2>
          <p className="text-brand-100/65 text-lg mb-10 max-w-xl mx-auto">
            Pronto para impulsionar sua próxima transformação digital? Fale com um de nossos consultores.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <a href="tel:+5521975542783" className="flex items-center gap-3 border border-brand-800 bg-brand-900/20 hover:border-brand-600 rounded-2xl p-4 w-full sm:w-auto px-8 transition-all">
              <span className="text-xl">📞</span>
              <div className="text-left">
                <p className="text-xs text-brand-400">Telefone / WhatsApp</p>
                <p className="text-sm font-bold text-white">(21) 97554-2783</p>
              </div>
            </a>
            <a href="mailto:contato.cpxlabs@gmail.com" className="flex items-center gap-3 border border-brand-800 bg-brand-900/20 hover:border-brand-600 rounded-2xl p-4 w-full sm:w-auto px-8 transition-all">
              <span className="text-xl">📧</span>
              <div className="text-left">
                <p className="text-xs text-brand-400">E-mail</p>
                <p className="text-sm font-bold text-white">contato.cpxlabs@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
