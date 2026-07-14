export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
  status: "available" | "beta" | "planned";
  repoUrl?: string;
  features: string[];
  supportedPlatforms?: string[];
}

export const tools: Tool[] = [
  {
    slug: "cv-smart-assistant",
    name: "CV Smart Assistant",
    tagline:
      "Extração de currículos em PDF e autopreenchimento de formulários de vagas",
    description:
      "Extensão para Chrome (Manifest V3) que analisa currículos em PDF e preenche automaticamente formulários de candidatura a vagas.",
    icon: "📄",
    category: "Produtividade & Recrutamento",
    status: "available",
    repoUrl: "https://github.com/az1nn/py",
    features: [
      "Extração multilíngue de currículos (EN, PT, ES, FR, DE, ZH, JA)",
      "Detecção inteligente de campos (nome, e-mail, telefone, LinkedIn, GitHub, skills, formação, experiência)",
      "Autopreenchimento em LinkedIn, Greenhouse, Lever, Workday e sites genéricos",
      "Filtro de vagas no LinkedIn",
      'Menu de contexto "Mapear para campo de CV" (right-click)',
      "Armazenamento local seguro dos dados",
    ],
    supportedPlatforms: ["LinkedIn", "Greenhouse", "Lever", "Workday", "Generic"],
  },
  {
    slug: "em-breve",
    name: "Em Breve",
    tagline: "Novas ferramentas estão a caminho",
    description:
      "Estamos desenvolvendo novas ferramentas para ampliar o portfólio da CPX Labs. Este é um espaço reservado para demonstrar a estrutura de adição de futuras ferramentas.",
    icon: "🚧",
    category: "Em Planejamento",
    status: "planned",
    features: ["Funcionalidades serão anunciadas em breve"],
  },
];
