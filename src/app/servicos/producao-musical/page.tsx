import Link from "next/link";

export default function ClusterProdutoraPage() {
  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-10 pb-6 border-b-2 border-brand-500">
          <p className="text-xs tracking-[0.2em] uppercase text-brand-400 font-mono">
            CPX Labs
          </p>
          <h1 className="text-3xl font-bold mt-1 tracking-tight">
            CLUSTER PRODUTORA
          </h1>
          <p className="text-sm mt-2 text-brand-200/70">
            Produção de áudio para artistas independentes e marcas &middot; Termo técnico de serviço
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            1. Equipe Técnica
          </h2>
          <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-5 space-y-3">
            <p><strong>Prince' Gutt</strong> &middot; Multi-instrumentista &middot; Produtor &middot; Foco: <em>criação de instrumental e edição</em>.</p>
            <p><strong>Az1nn</strong> &middot; Multi-instrumentista &middot; Engenheiro &middot; Foco: <em>pós-produção, mixagem e masterização</em>.</p>
            <p className="text-xs text-brand-200/60">Ambos certificados em mixagem e masterização.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            2. Serviços e Valores
          </h2>
          <div className="overflow-x-auto rounded-xl border border-brand-800">
            <table className="w-full text-sm">
              <thead className="bg-brand-900/80">
                <tr className="border-b border-brand-800">
                  <th className="text-left p-4 font-semibold">Serviço</th>
                  <th className="text-left p-4 font-semibold">Escopo</th>
                  <th className="text-right p-4 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-800">
                  <td className="p-4 font-semibold align-top">Produção de Single</td>
                  <td className="p-4 align-top text-brand-200/70">Instrumental + gravação de voz + edição + mixagem + masterização</td>
                  <td className="p-4 text-right font-bold">R$ 600,00</td>
                </tr>
                <tr className="border-b border-brand-800">
                  <td className="p-4 font-semibold align-top">Pós-Produção de Single</td>
                  <td className="p-4 align-top text-brand-200/70">Edição + mixagem + masterização (gravação já existente)</td>
                  <td className="p-4 text-right font-bold">R$ 400,00</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold align-top">EP / Álbum</td>
                  <td className="p-4 align-top text-brand-200/70">Escopo completo de Single por faixa · Identidade sonora unificada · Masterização em conjunto</td>
                  <td className="p-4 text-right font-semibold">
                    Valor por faixa<br />
                    <span className="text-xs font-normal text-brand-200/60">Parcelado em até X vezes via Mercado Livre · Taxas de cartão adicionais</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            3. Processo de Produção de Single
          </h2>
          <ol className="space-y-3 text-sm">
            <li className="rounded-xl border border-brand-800 bg-brand-900/50 p-4">
              <strong>3.1 Pré-produção</strong><br />
              <span className="text-brand-200/70">Criação do instrumental a partir de guia (voz ou type beat). <strong>Etapa realizada antes da sessão de estúdio</strong> para otimização de tempo.</span>
            </li>
            <li className="rounded-xl border border-brand-800 bg-brand-900/50 p-4">
              <strong>3.2 Sessão de gravação</strong><br />
              <span className="text-brand-200/70">Realizada com instrumental <strong>mínimo 60% estruturado</strong>. Inclui: <em>vocal comping</em> (seleção de takes) e limpeza de ruídos digitais (chiados, cliques).<br />
              Entregue nesta etapa: <strong>Rough Mix / cópia de monitor</strong> com efeitos (reverb, delay, afinação) e nível de loudness de mercado.</span>
            </li>
            <li className="rounded-xl border border-brand-800 bg-brand-900/50 p-4">
              <strong>3.3 Pós-produção</strong><br />
              <span className="text-brand-200/70">Edição fina · Afinação precisa · Limpeza de respirações e sibilâncias ("s") · Mixagem · Masterização.<br />
              <strong>Prazo: 15 a 30 dias corridos</strong>. Intervalos intencionais entre sessões preservam a capacidade auditiva de julgamento.</span>
            </li>
            <li className="rounded-xl border border-brand-800 bg-brand-900/50 p-4">
              <strong>3.4 Entrega V1 e ajustes</strong><br />
              <span className="text-brand-200/70">Primeira versão finalizada com sessão aberta para correções. Ajustes devem ser solicitados <strong>por tempo da música / trecho da letra</strong>, com referência de loudness (LUFS).<br />
              Incluídos: <strong>até 2 (duas) sessões de recall</strong>. Excedido este limite, serão cobradas taxas adicionais conforme escopo da alteração, que poderá exigir retorno de etapas anteriores.</span>
            </li>
            <li className="rounded-xl border border-brand-800 bg-brand-900/50 p-4">
              <strong>3.5 Entrega final</strong><br />
              <span className="text-brand-200/70">Envio dos arquivos aprovados via WeTransfer ou e-mail.</span>
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            4. Arquivos Entregues
          </h2>
          <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-5 text-sm space-y-2">
            <p><strong>4.1</strong> Master final em <strong>WAV 24bit/48kHz</strong> e <strong>MP3 320kbps</strong>.</p>
            <p><strong>4.2</strong> <strong>Stems</strong> (formato compatível com Bandlab / Moisés AI): Voz Lead · Backing Vocals · Drums · Bass · Others.</p>
            <p><strong>4.3</strong> <strong>Click Track</strong> (metrônomo), sob solicitação do artista.</p>
            <p className="pt-2 mt-2 border-t border-brand-800 text-brand-200/60 text-xs">Stems destinam-se a apresentações ao vivo, remixes, covers e versões alternativas.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            5. Credenciais Técnicas
          </h2>
          <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-5 text-sm space-y-2">
            <p><strong>5.1</strong> Equipe com <strong>mais de 10 anos de experiência</strong> de mercado.</p>
            <p><strong>5.2</strong> Formação: <strong>Iatec</strong> (corpo docente: Luiz Tornaghi, Carlos Pedruzzi) e <strong>Senac</strong>. Mentoria com Pedro Peixoto, Nico Braganholo e Cris Simões.</p>
            <p><strong>5.3</strong> <strong>Mais de 200 músicas</strong> produzidas e disponíveis nas plataformas de streaming.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-brand-400 font-mono text-sm">
            6. Disposições Gerais
          </h2>
          <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-5 text-sm text-brand-200/70 space-y-2">
            <p>6.1 Valores não incluem taxas de operadoras de cartão ou plataformas de pagamento.</p>
            <p>6.2 O início dos serviços está condicionado à confirmação do pagamento.</p>
            <p>6.3 Esta descrição substitui quaisquer versões anteriores e serve como base formal para o contrato de prestação de serviço.</p>
          </div>
        </section>

        <div className="text-center mb-8">
          <Link
            href="/servicos/producao-musical/contrato"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97]"
          >
            Solicitar Serviço
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="pt-6 text-center text-xs border-t border-brand-800 text-brand-200/60">
          <p><strong>Cluster Produtora</strong> &middot; Um braço do CPX Labs</p>
        </div>

      </div>
    </section>
  );
}
