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
    color: "bg-brand-700",
  },
  {
    name: "Ana Lima",
    role: "CTO & Co-fundadora",
    bio: "Especialista em arquitetura de software, cloud e segurança da informação.",
    initials: "AL",
    color: "bg-brand-600",
  },
  {
    name: "Rafael Souza",
    role: "Head de Engenharia",
    bio: "Expert em desenvolvimento fullstack e liderança de times de alta performance.",
    initials: "RS",
    color: "bg-brand-500",
  },
  {
    name: "Beatriz Santos",
    role: "Head de Projetos",
    bio: "PMP certificada com vasta experiência em gestão ágil de projetos de TI complexos.",
    initials: "BS",
    color: "bg-brand-400",
  },
];

export default function QuemSomosPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-16">
          <span className="mb-4 inline-block rounded-full border border-brand-400/30 bg-brand-500/12 px-4 py-1.5 text-sm font-semibold text-brand-100">
            Nossa história
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Quem Somos
          </h1>
          <p className="text-brand-100/72 text-lg max-w-3xl mx-auto">
            O CPX Labs é uma consultoria de TI especializada em transformação
            digital. Nascemos da visão de que tecnologia deve ser um{" "}
            <strong className="text-white">diferencial estratégico</strong>{" "}
            — não apenas infraestrutura. Trabalhamos lado a lado com nossos
            clientes para criar soluções que realmente fazem a diferença.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-brand-800 bg-brand-900/60 p-8 text-center shadow-sm transition-all duration-400 ease-out-expo hover:-translate-y-1 hover:border-brand-600 hover:shadow-lg hover:shadow-brand-500/8"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-800/60 text-3xl shadow-sm transition-transform duration-300 ease-spring group-hover:scale-110">
                {item.icon}
              </div>
              <h2 className="mb-3 text-xl font-bold text-white">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-brand-100/68">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-12">
            Por que escolher o CPX Labs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
              <div key={item.title} className="flex gap-4 rounded-2xl border border-brand-800 bg-brand-900/40 p-6 transition-all duration-300 hover:border-brand-600 hover:bg-brand-900/80">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-500">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-sm text-brand-100/68">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { number: "2014", label: "Fundação" },
            { number: "50+", label: "Projetos" },
            { number: "30+", label: "Clientes" },
            { number: "5", label: "Países atendidos" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-brand-800 bg-brand-900/60 p-6 text-center transition-transform duration-300 ease-spring hover:scale-[1.03] hover:border-brand-600"
            >
              <p className="text-3xl font-extrabold text-brand-300">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-brand-100/68">{stat.label}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
            Nossa Liderança
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl border border-brand-800 bg-brand-900/60 p-6 text-center transition-all duration-400 ease-out-expo hover:-translate-y-1 hover:border-brand-600 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <div
                  className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="mb-2 text-sm font-medium text-brand-300">
                  {member.role}
                </p>
                <p className="text-sm text-brand-100/68">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
