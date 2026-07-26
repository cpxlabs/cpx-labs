import { homeServices } from "@/lib/services";

export default function Services() {
  return (
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
          {homeServices.map((service) => (
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
  );
}
