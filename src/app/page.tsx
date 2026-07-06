import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";

export default function HomePage() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[24rem] w-[24rem] rounded-full bg-brand-500/24 blur-3xl animate-pulse-subtle" />
        <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-700/30 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-400/12 blur-3xl animate-pulse-subtle" style={{ animationDelay: "2s" }} />
        <ThreeScene containerClassName="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] hidden lg:block opacity-40" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/12 px-4 py-2 text-sm font-medium text-brand-100 animate-fade-in-down">
          <span className="h-2 w-2 rounded-full bg-brand-300 animate-pulse" />
          Consultoria em TI de Alta Performance
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          Transformando negócios{" "}
          <span className="bg-gradient-to-r from-brand-100 via-brand-300 to-brand-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
            através da tecnologia
          </span>
        </h1>

        <p className="text-brand-100/72 text-lg sm:text-xl max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          O CPX Labs é o seu parceiro estratégico em inovação tecnológica.
          Desenvolvemos soluções sob medida para acelerar o crescimento da sua
          empresa com segurança e eficiência.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          <Link
            href="/servicos"
            className="rounded-full bg-brand-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-spring hover:bg-brand-400 brand-glow active:scale-[0.97]"
          >
            Nossos Serviços
          </Link>
          <Link
            href="/contato"
            className="rounded-full border border-brand-700 px-8 py-4 text-lg font-semibold text-brand-100 transition-all duration-300 ease-spring hover:border-brand-400 hover:bg-brand-900/60 hover:text-white active:scale-[0.97]"
          >
            Falar com Consultor
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { number: "50+", label: "Projetos Entregues" },
            { number: "30+", label: "Clientes Ativos" },
            { number: "10+", label: "Anos de Experiência" },
            { number: "99%", label: "Satisfação" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
              <p className="text-3xl font-bold text-white">{stat.number}</p>
              <p className="mt-1 text-sm text-brand-200/72">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
