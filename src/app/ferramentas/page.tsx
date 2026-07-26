import Link from "next/link";
import { tools } from "@/lib/tools";

export default function FerramentasPage() {
  const featured = tools.find((tool) => tool.slug === "cv-smart-assistant");
  const planned = tools.filter((tool) => tool.status === "planned");

  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-8 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent">
            Ferramentas
          </h1>
          <p className="text-brand-100/70 text-lg max-w-2xl mx-auto">
            Soluções práticas desenvolvidas pela CPX Labs para acelerar o seu
            trabalho e simplificar tarefas do dia a dia.
          </p>
        </div>

        {featured && (
          <div className="rounded-3xl border border-brand-900 bg-gradient-to-br from-brand-900/30 to-brand-800/10 p-8 md:p-12 mb-16 hover:border-brand-700 transition-all duration-350 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-800/40 text-4xl brand-glow">
                  {featured.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {featured.name}
                  </h2>
                  <span className="text-xs bg-brand-500/20 text-brand-200 border border-brand-500/30 rounded-full px-3 py-1 font-medium">
                    Disponível
                  </span>
                </div>
                <p className="text-brand-300 text-base font-medium mb-4">
                  {featured.tagline}
                </p>
                <p className="text-brand-100/60 text-base leading-relaxed mb-6 max-w-3xl">
                  {featured.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-brand-950/40 border border-brand-900/60 rounded-2xl p-6">
                    <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-4">
                      Recursos
                    </p>
                    <ul className="space-y-3">
                      {featured.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-brand-200/80"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-brand-950/40 border border-brand-900/60 rounded-2xl p-6 flex flex-col">
                    <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-4">
                      Plataformas Suportadas
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featured.supportedPlatforms?.map((platform) => (
                        <span
                          key={platform}
                          className="text-xs bg-brand-800/60 text-brand-200 border border-brand-700/40 rounded-full px-4 py-2 font-medium"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-brand-100/50 mt-auto leading-relaxed">
                      O código-fonte desta ferramenta está disponível em{" "}
                      <code className="text-brand-300">tools/cv-smart-assistant/</code>{" "}
                      no repositório do projeto.
                    </p>
                  </div>
                </div>

                {featured.repoUrl && (
                  <Link
                    href={featured.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-brand-400 brand-glow active:scale-[0.97]"
                  >
                    Ver no GitHub &rarr;
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 md:p-12 mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Como Instalar e Usar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-brand-950/40 border border-brand-900/60 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800/40 text-sm font-extrabold text-brand-300">1</span>
                Instalação Local (Desenvolvimento)
              </h3>
              <ol className="space-y-3 text-sm text-brand-200/80 list-decimal list-inside marker:text-brand-500">
                <li>Abra <code className="text-brand-300 bg-brand-950/60 px-1.5 py-0.5 rounded">chrome://extensions</code> no Chrome</li>
                <li>Ative o <strong className="text-brand-200">Modo do Desenvolvedor</strong> (canto superior direito)</li>
                <li>Clique em <strong className="text-brand-200">Carregar sem compactação</strong> (Load unpacked)</li>
                <li>Selecione a pasta <code className="text-brand-300 bg-brand-950/60 px-1.5 py-0.5 rounded">tools/cv-smart-assistant/</code></li>
                <li>O ícone da extensão aparecerá na barra de ferramentas do Chrome</li>
              </ol>
            </div>

            <div className="bg-brand-950/40 border border-brand-900/60 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800/40 text-sm font-extrabold text-brand-300">2</span>
                Instalação Publicada (Chrome Web Store)
              </h3>
              <p className="text-sm text-brand-200/80 mb-4">
                Quando publicado, instale diretamente da Chrome Web Store:
              </p>
              <div className="bg-brand-950/60 border border-dashed border-brand-800 rounded-xl p-4 text-center">
                <p className="text-brand-400 text-sm italic">
                  [URL da Chrome Web Store será inserida aqui após a publicação]
                </p>
              </div>
              <p className="text-xs text-brand-100/50 mt-3">
                A publicação na Chrome Web Store está em andamento. Enquanto isso, utilize o método de instalação local acima.
              </p>
            </div>
          </div>

          <div className="bg-brand-950/40 border border-brand-900/60 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800/40 text-sm font-extrabold text-brand-300">3</span>
              Como Usar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-brand-200 mb-3">Extrair currículo:</p>
                <ol className="space-y-2 text-sm text-brand-200/80 list-decimal list-inside marker:text-brand-500">
                  <li>Clique no ícone da extensão na barra de ferramentas</li>
                  <li>Faça upload de um currículo em PDF</li>
                  <li>Revise os dados extraídos e salve</li>
                </ol>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-200 mb-3">Autopreenchimento de vagas:</p>
                <ol className="space-y-2 text-sm text-brand-200/80 list-decimal list-inside marker:text-brand-500">
                  <li>Acesse uma vaga no <strong className="text-brand-200">LinkedIn</strong>, <strong className="text-brand-200">Greenhouse</strong>, <strong className="text-brand-200">Lever</strong> ou <strong className="text-brand-200">Workday</strong></li>
                  <li>Clique com o botão direito em qualquer campo e selecione <strong className="text-brand-200">&ldquo;Mapear para campo de CV&rdquo;</strong></li>
                  <li>Use o botão <strong className="text-brand-200">Autopreencher</strong> da extensão para preencher todo o formulário</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">
            Todas as Ferramentas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const isPlanned = tool.status === "planned";
              return (
                <div
                  key={tool.slug}
                  className={`group rounded-3xl border p-8 shadow-sm transition-all duration-350 ${
                    isPlanned
                      ? "border-brand-900/50 bg-brand-900/5 opacity-70 hover:opacity-90"
                      : "border-brand-900 bg-brand-900/10 hover:border-brand-700/60 hover:bg-brand-900/30"
                  }`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl group-hover:scale-105 transition-all">
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-brand-300">
                      {tool.name}
                    </h3>
                    {isPlanned && (
                      <span className="text-[10px] bg-brand-800/60 text-brand-200 border border-brand-700/40 rounded-full px-2 py-0.5 font-medium uppercase">
                        Em breve
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-400 font-medium uppercase tracking-wider mb-3">
                    {tool.category}
                  </p>
                  <p className="text-sm leading-relaxed text-brand-100/60 mb-5">
                    {tool.tagline}
                  </p>
                  {tool.repoUrl && (
                    <Link
                      href={tool.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 font-medium"
                    >
                      GitHub &rarr;
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {planned.length > 0 && (
          <div className="rounded-3xl border border-dashed border-brand-800 bg-brand-950/40 p-8 mb-16 text-center">
            <p className="text-brand-100/60 text-sm">
              Quer sugerir uma ferramenta? Estamos sempre expandindo o nosso
              portfólio.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-brand-100/60 mb-6">
            Tem uma ideia de ferramenta ou quer saber mais?
          </p>
          <Link
            href="/contato"
            className="inline-block rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 ease-spring hover:bg-brand-400 brand-glow active:scale-[0.97]"
          >
            Falar com Consultor &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
