import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[24rem] w-[24rem] rounded-full bg-brand-500/20 blur-3xl animate-pulse-subtle" />
        <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-700/24 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-400/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: "2s" }} />
      </div>
      <ThreeScene containerClassName="absolute inset-0 w-full h-full opacity-60 z-0 pointer-events-auto" />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center lg:text-left z-10">
        <div className="lg:max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
            Engenharia de Precisão para{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(to right, #dcc6ff, #a164ff, #c29fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Transformação Digital
            </span>
          </h1>

          <p className="text-brand-100/70 text-lg sm:text-xl max-w-2xl lg:mx-0 mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            Custom software development, Cloud intelligence, AI solutions, Cybersecurity and Strategic IT Consulting for high-impact results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link
              href="/servicos"
              className="rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-brand-400 brand-glow active:scale-[0.97]"
            >
              Começar
            </Link>
            <Link
              href="/contato"
              className="rounded-full border border-brand-700 px-8 py-4 text-base font-semibold text-brand-100 transition-all duration-300 hover:border-brand-400 hover:bg-brand-900/60 active:scale-[0.97]"
            >
              Falar com Consultor &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mt-12 animate-fade-in-up" style={{ animationDelay: "450ms" }}>
            {[
              { number: "50+", label: "Projetos Entregues" },
              { number: "98%", label: "Taxa de Sucesso (NPS Fiel)" },
              { number: "10+", label: "Anos de Experiência" },
            ].map((stat) => (
              <div key={stat.label} className="border border-brand-800/40 bg-brand-900/30 backdrop-blur-sm rounded-2xl p-5 hover:border-brand-700/60 transition-all duration-350">
                <p className="text-3xl font-extrabold text-brand-300">{stat.number}</p>
                <p className="mt-1 text-xs text-brand-200/70 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
