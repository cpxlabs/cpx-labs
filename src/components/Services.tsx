const services = [
  {
    icon: "💻",
    title: "Desenvolvimento de Software",
    description:
      "Criamos aplicações web, mobile e desktop sob medida, utilizando as tecnologias mais modernas e adequadas ao seu negócio.",
    highlights: ["React / Next.js", "Node.js / APIs REST", "Apps Mobile", "Sistemas Corporativos"],
  },
  {
    icon: "☁️",
    title: "Cloud & Infraestrutura",
    description:
      "Migração, arquitetura e gerenciamento de ambientes em nuvem com foco em escalabilidade, segurança e redução de custos.",
    highlights: ["AWS / Azure / GCP", "Containerização Docker", "CI/CD Pipelines", "Monitoramento 24/7"],
  },
  {
    icon: "🔒",
    title: "Segurança da Informação",
    description:
      "Protegemos os ativos digitais da sua empresa com análises de vulnerabilidade, conformidade e políticas de segurança robustas.",
    highlights: ["Pentest & Auditoria", "LGPD / Compliance", "SOC & SIEM", "Zero Trust"],
  },
  {
    icon: "📊",
    title: "Business Intelligence & Dados",
    description:
      "Transformamos dados em insights estratégicos com dashboards, analytics avançado e soluções de Big Data.",
    highlights: ["Dashboards em tempo real", "ETL & Data Warehouse", "Machine Learning", "Power BI / Metabase"],
  },
  {
    icon: "🤖",
    title: "Inteligência Artificial",
    description:
      "Implementamos soluções de IA e automação para aumentar a produtividade e competitividade do seu negócio.",
    highlights: ["Chatbots & Assistentes", "Processamento de Linguagem", "Automação de Processos", "Computer Vision"],
  },
  {
    icon: "🧩",
    title: "Consultoria & Arquitetura",
    description:
      "Orientamos sua equipe técnica e liderança com melhores práticas, arquitetura de sistemas e gestão de TI estratégica.",
    highlights: ["Revisão de Arquitetura", "CTO as a Service", "Gestão Ágil", "Treinamento de Times"],
  },
];

export default function Services() {
  return (
    <section id="servicos" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-sky-100 text-sky-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            O que fazemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Nossas Soluções em TI
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Oferecemos um portfólio completo de serviços tecnológicos para
            impulsionar a transformação digital da sua empresa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                {service.description}
              </p>
              <ul className="space-y-1.5">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
