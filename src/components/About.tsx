const values = [
  {
    title: "Inovação",
    desc: "Soluções modernas e disruptivas.",
  },
  {
    title: "Integridade",
    desc: "Parceria de longo prazo baseada em confiança.",
  },
  {
    title: "Qualidade",
    desc: "Código limpo e arquitetura escalável.",
  },
];

export default function About() {
  return (
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
              {values.map((item) => (
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
                  mission: <span className="text-green-400">&quot;Transformação Digital&quot;</span>,
                  focus: [<span className="text-green-400">&quot;IA&quot;</span>, <span className="text-green-400">&quot;Cloud&quot;</span>, <span className="text-green-400">&quot;Security&quot;</span>],
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
  );
}
