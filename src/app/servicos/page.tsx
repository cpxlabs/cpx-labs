import Link from "next/link";
import { fullServices } from "@/lib/services";

export default function ServicosPage() {
  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Nossos Serviços
          </h1>
          <p className="text-brand-100/70 text-lg max-w-2xl mx-auto">
            Soluções de engenharia de software de ponta, desenvolvidas sob medida com foco na segurança e escalabilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {fullServices.map((service) => {
            const isFullWidth = service.fullWidth ?? false;
            return (
              <div
                key={service.title}
                className={`group rounded-3xl border border-brand-900 bg-brand-900/10 p-8 shadow-sm transition-all duration-350 hover:border-brand-700/60 hover:bg-brand-900/30 ${
                  isFullWidth ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl group-hover:scale-105 transition-all">
                      {service.icon}
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-brand-300">
                      {service.title}
                    </h2>
                    <p className="mb-5 text-sm leading-relaxed text-brand-100/60 max-w-xl">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-60 bg-brand-950/40 border border-brand-900/60 rounded-2xl p-5 flex flex-col justify-center">
                    <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-3">Highlights</p>
                    <ul className="space-y-2">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-brand-200/80">
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-brand-900 bg-gradient-to-r from-brand-900/30 to-brand-800/20 p-8 md:p-12 hover:border-brand-700 transition-all duration-350">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Consultoria Estratégica em TI
              </h2>
              <p className="text-brand-100/60 text-base leading-relaxed max-w-2xl mb-8">
                Orientamos sua equipe técnica e liderança com melhores práticas, arquitetura de sistemas e gestão de TI estratégica.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Revisão de Arquitetura", "CTO as a Service", "Treinamento de Times"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-brand-800/60 text-brand-200 border border-brand-700/40 rounded-full px-4 py-2 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 h-24 w-24 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-4xl text-brand-400">
              ⚙️
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-brand-100/60 mb-6">
            Quer saber como podemos ajudar o seu negócio?
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
