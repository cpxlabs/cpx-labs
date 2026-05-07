const values = [
  {
    icon: "🎯",
    title: "Missão",
    description:
      "Entregar soluções tecnológicas de alto impacto que resolvam problemas reais e gerem valor duradouro para nossos clientes.",
  },
  {
    icon: "🔭",
    title: "Visão",
    description:
      "Ser reconhecido como o parceiro tecnológico de referência para empresas que buscam inovar com excelência e segurança.",
  },
  {
    icon: "💎",
    title: "Valores",
    description:
      "Transparência, excelência técnica, comprometimento com resultados e relações de longo prazo baseadas em confiança.",
  },
];

const team = [
  {
    name: "Carlos Pereira",
    role: "CEO & Co-fundador",
    bio: "15 anos de experiência em TI e gestão de produtos digitais em empresas de grande porte.",
    initials: "CP",
    color: "bg-sky-500",
  },
  {
    name: "Ana Lima",
    role: "CTO & Co-fundadora",
    bio: "Especialista em arquitetura de software, cloud e segurança da informação.",
    initials: "AL",
    color: "bg-indigo-500",
  },
  {
    name: "Rafael Souza",
    role: "Head de Engenharia",
    bio: "Expert em desenvolvimento fullstack e liderança de times de alta performance.",
    initials: "RS",
    color: "bg-emerald-500",
  },
  {
    name: "Beatriz Santos",
    role: "Head de Projetos",
    bio: "PMP certificada com vasta experiência em gestão ágil de projetos de TI complexos.",
    initials: "BS",
    color: "bg-amber-500",
  },
];

export default function About() {
  return (
    <section id="quem-somos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-sky-100 text-sky-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Nossa história
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Quem Somos
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto">
            O CPX Labs é uma consultoria de TI especializada em transformação
            digital. Nascemos da visão de que tecnologia deve ser um{" "}
            <strong className="text-slate-700">diferencial estratégico</strong>{" "}
            — não apenas infraestrutura. Trabalhamos lado a lado com nossos
            clientes para criar soluções que realmente fazem a diferença.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((item) => (
            <div
              key={item.title}
              className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
              Por que escolher o CPX Labs?
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Time sênior e especializado",
                  desc: "Nossa equipe é formada por profissionais com experiência comprovada em projetos de grande escala.",
                },
                {
                  title: "Metodologia ágil e transparente",
                  desc: "Adotamos frameworks ágeis com comunicação contínua para entregar valor desde o primeiro sprint.",
                },
                {
                  title: "Soluções sob medida",
                  desc: "Não acreditamos em soluções genéricas. Cada projeto é tratado com a atenção que ele merece.",
                },
                {
                  title: "Suporte e parceria de longo prazo",
                  desc: "Estamos presentes após a entrega para garantir a evolução contínua da sua plataforma.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "2014", label: "Fundação" },
              { number: "50+", label: "Projetos" },
              { number: "30+", label: "Clientes" },
              { number: "5", label: "Países atendidos" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900 rounded-2xl p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-sky-400">
                  {stat.number}
                </p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-10">
            Nossa Liderança
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}
                >
                  {member.initials}
                </div>
                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <p className="text-sky-600 text-sm font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-slate-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
