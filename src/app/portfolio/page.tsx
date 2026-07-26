"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    name: "Smokebuzz",
    slug: "smokebuzz",
    description:
      "Aplicativo social PWA em React Native construído com Expo, TypeScript e NativeWind. Plataforma mobile-first com experiência progressiva na web.",
    repo: "https://github.com/az1nn/smokebuzz",
    demo: "https://smokebuzz.vercel.app",
    tags: ["React Native", "Expo", "TypeScript", "NativeWind", "PWA"],
  },
  {
    name: "OpenBand",
    slug: "openband",
    description:
      "Plataforma open-source de produção musical — DAW multi-track, pedalboard, modelagem de amp/cab, separação de stems, feed social e design web-first responsivo.",
    repo: "https://github.com/cpxlabs/openband",
    demo: "https://openband-one.vercel.app",
    tags: [
      "Expo Router",
      "TypeScript",
      "NativeWind",
      "Supabase",
      "Three.js",
      "Electron",
    ],
  },
  {
    name: "Cazimu",
    slug: "cazimu",
    description:
      "Site institucional para a editora Cazimu — music house com roster de artistas, lançamentos, conteúdo editorial e área de imprensa.",
    repo: "https://github.com/cpxlabs/cazimu-site",
    demo: "https://cazimu-site.vercel.app",
    tags: ["React", "Vite", "TypeScript", "Framer Motion"],
  },
  {
    name: "Lilly's Box",
    slug: "lillys-box",
    description:
      "Jogo 2D infantil multiplataforma — cuide de animais de estimação virtuais e divirta-se com 36 mini-games educativos. Construído com React Native e Expo.",
    repo: "https://github.com/cpxlabs/lillys-box",
    demo: "https://pet-care-game.vercel.app",
    tags: ["React Native", "Expo", "TypeScript", "i18n", "Google OAuth"],
  },
  {
    name: "Fullstack Log Tower",
    slug: "log-tower",
    description:
      "Plataforma de análise de logs com ingestão de alto volume, armazenamento em PostgreSQL (Prisma) e dashboard de visualização com filtros e gráficos.",
    repo: "https://github.com/az1nn/fullstack-log-tower",
    demo: "https://fullstack-log-tower.vercel.app",
    tags: ["Fastify", "React", "Prisma", "PostgreSQL", "Docker", "TypeScript"],
  },
  {
    name: "Hemp Ramps 3D",
    slug: "hemp",
    description:
      "Configurador 3D de produtos em tempo real com Three.js e React Native Web. Customização dinâmica de materiais e geometria com visualização imersiva.",
    repo: "https://github.com/cpxlabs/hemp",
    demo: "https://saudade-rn.vercel.app",
    tags: [
      "Three.js",
      "React Three Fiber",
      "Expo",
      "NativeWind",
      "Framer Motion",
    ],
  },
  {
    name: "MR. BANDS",
    slug: "mr-bands",
    description:
      "Portfólio de arte geométrica 3D com estética dark, neon e animações CSS/Canvas. Site PWA do artista visual MR. BANDS com obras disponíveis e encomendas.",
    repo: "https://github.com/cpxlabs/mr-bands",
    demo: "https://mr-bands.vercel.app",
    tags: ["Vite", "JavaScript", "Canvas API", "PWA", "CSS Animations"],
  },
];

export default function PortfolioPage() {
  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-8 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent">
            Portfólio
          </h1>
          <p className="text-brand-100/70 text-lg max-w-2xl mx-auto">
            Projetos open-source desenvolvidos por CPX Labs e az1nn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group rounded-3xl border border-brand-900 bg-gradient-to-br from-brand-900/30 to-brand-800/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-700 hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)] animate-fade-in-up flex flex-col">
      <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-brand-900/40">
        {!imgError ? (
          <img
            src={`/portfolio/${project.slug}.png`}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
            <span className="text-4xl opacity-30">◆</span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-brand-300">
        {project.name}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-brand-800/60 text-brand-300 border border-brand-700/40 rounded-full px-3 py-1 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-brand-100/60 mb-6 flex-1">
        {project.description}
      </p>

      <div className="flex items-center gap-3 mt-auto">
        <Link
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-400 brand-glow active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </Link>
        <Link
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-200 transition-all duration-300 hover:bg-brand-800/60 hover:border-brand-500 hover:text-white active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Live Demo
        </Link>
      </div>
    </div>
  );
}
