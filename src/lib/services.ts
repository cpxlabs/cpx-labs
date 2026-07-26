export interface HomeService {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface FullService {
  icon: string;
  title: string;
  description: string;
  highlights: string[];
}

export const homeServices: HomeService[] = [
  {
    icon: "💻",
    title: "Desenvolvimento de Software",
    desc: "Criamos aplicações web, mobile e desktop sob medida, utilizando as tecnologias mais modernas e adequadas.",
    tags: ["React", "Node.js"],
  },
  {
    icon: "☁️",
    title: "Computação em Nuvem",
    desc: "Migração, arquitetura e gerenciamento de ambientes em nuvem com foco em escalabilidade e redução de custos.",
    tags: ["AWS", "Azure"],
  },
  {
    icon: "🔒",
    title: "Cibersegurança",
    desc: "Protegemos os ativos digitais da sua empresa com análises de vulnerabilidade, conformidade e políticas.",
    tags: ["SOC", "Compliance"],
  },
  {
    icon: "📊",
    title: "Business Intelligence",
    desc: "Transformamos dados em insights estratégicos com dashboards, analytics avançado e soluções de Big Data.",
    tags: ["Power BI", "ETL"],
  },
  {
    icon: "🤖",
    title: "Inteligência Artificial",
    desc: "Implementamos soluções de IA e automação para aumentar a produtividade e competitividade do seu negócio.",
    tags: ["Python", "APIs"],
  },
  {
    icon: "🧩",
    title: "Consultoria Estratégica de TI",
    desc: "Orientamos sua equipe técnica e liderança com melhores práticas, arquitetura de sistemas e gestão ágil.",
    tags: ["CTO as a Service", "Agile"],
  },
];

export const fullServices: FullService[] = [
  {
    icon: "🤖",
    title: "Inteligência Artificial",
    description:
      "Implementamos soluções de IA e automação para aumentar a produtividade e competitividade do seu negócio.",
    highlights: ["Machine Learning", "Computer Vision", "Chatbots & NLP"],
  },
  {
    icon: "☁️",
    title: "Cloud Computing",
    description:
      "Migração, arquitetura e gerenciamento de ambientes em nuvem com foco em escalabilidade, segurança e redução de custos.",
    highlights: ["AWS / Azure / GCP", "Docker & Kubernetes", "CI/CD Pipelines"],
  },
  {
    icon: "🔒",
    title: "Cyber Security",
    description:
      "Protegemos os ativos digitais da sua empresa com análises de vulnerabilidade, conformidade e políticas de segurança robustas.",
    highlights: ["Pentest & Auditoria", "Zero Trust", "LGPD / Compliance"],
  },
  {
    icon: "💻",
    title: "Software Development",
    description:
      "Criamos aplicações web, mobile e desktop sob medida, utilizando as tecnologias mais modernas e adequadas ao seu negócio.",
    highlights: ["React / Next.js", "Node.js APIs", "Apps Mobile"],
  },
  {
    icon: "📊",
    title: "Business Intelligence",
    description:
      "Transformamos dados em insights estratégicos com dashboards, analytics avançado e soluções de Big Data.",
    highlights: ["Dashboards", "ETL / Data Lakes", "Analytics"],
  },
];
