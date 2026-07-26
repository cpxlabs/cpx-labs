export default function QuemSomosPage() {
  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Quem Somos
          </h1>
          <p className="text-brand-100/70 text-lg max-w-2xl mx-auto">
            Transformando ideias em soluções digitais robustas. A CPX Labs é a sua parceira ideal de tecnologia para impulsionar o seu negócio.
          </p>
        </div>

        {/* Large Banner Graphic representing futuristic workspace/team */}
        <div
          className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-16 border border-brand-900 bg-cover bg-center flex items-center justify-center p-8"
          style={{ backgroundImage: "linear-gradient(rgba(22,0,47,0.7), rgba(22,0,47,0.85)), url('/cosmic-bg.png')" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
          <div className="relative text-center max-w-xl z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-brand-100 to-brand-300 bg-clip-text text-transparent">
              Inovação Conectada ao Futuro
            </h2>
            <p className="text-brand-100/60 text-sm sm:text-base">
              Combinamos excelência técnica e visão estratégica para projetar infraestruturas de nuvem, modelos inteligentes de IA e softwares sob medida.
            </p>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 shadow-sm hover:border-brand-700 transition-all duration-350">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl text-brand-300">
              🎯
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Nossa Missão
            </h2>
            <p className="text-brand-100/60 leading-relaxed text-sm">
              Entregar soluções de alta tecnologia que resolvam desafios reais e gerem impacto duradouro para nossos clientes, otimizando seus fluxos e inovando processos.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 shadow-sm hover:border-brand-700 transition-all duration-350">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl text-brand-300">
              🔭
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Nossa Visão
            </h2>
            <p className="text-brand-100/60 leading-relaxed text-sm">
              Ser referência no desenvolvimento de software de alta performance e inovação em soluções de nuvem e IA, crescendo de forma sustentável e transparente.
            </p>
          </div>
        </div>

        {/* Valores Fundamentais */}
        <div className="border-t border-brand-900/40 pt-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4">
            Valores Fundamentais
          </h2>
          <p className="text-brand-100/60 text-sm sm:text-base text-center mb-12 max-w-xl mx-auto">
            O que nos move e orienta em cada projeto.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "Inovação",
                desc: "Soluções modernas e disruptivas baseadas no que há de mais recente no mercado."
              },
              {
                icon: "🤝",
                title: "Integridade",
                desc: "Relações de longo prazo fundadas em total transparência e ética com nossos parceiros."
              },
              {
                icon: "🏆",
                title: "Qualidade",
                desc: "Garantia de código limpo, testado e infraestrutura de alta disponibilidade e performance."
              }
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 text-center hover:border-brand-700 transition-all duration-350"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800/40 text-2xl mx-auto">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {value.title}
                </h3>
                <p className="text-brand-100/60 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nossa Liderança */}
        <div className="border-t border-brand-900/40 pt-16 mt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4">
            Nossa Liderança
          </h2>
          <p className="text-brand-100/60 text-sm sm:text-base text-center mb-12 max-w-xl mx-auto">
            Conheça o time que está à frente da CPX Labs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Carlos Pereira", role: "CEO & Co-fundador", bio: "15 anos de experiência em TI", initials: "CP", color: "bg-brand-700" },
              { name: "Ana Lima", role: "CTO & Co-fundadora", bio: "Especialista em arquitetura de software", initials: "AL", color: "bg-brand-600" },
              { name: "Rafael Souza", role: "Head de Engenharia", bio: "Expert em fullstack", initials: "RS", color: "bg-brand-500" },
              { name: "Beatriz Santos", role: "Head de Projetos", bio: "PMP certificada", initials: "BS", color: "bg-brand-400" },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-3xl border border-brand-900 bg-brand-900/10 p-8 text-center hover:border-brand-700 transition-all duration-350"
              >
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white ${member.color}`}
                >
                  {member.initials}
                </div>
                <h3 className="mb-1 text-xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="text-brand-100/60 font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-brand-100/40 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
