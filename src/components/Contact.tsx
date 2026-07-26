import Link from "next/link";

export default function Contact() {
  return (
    <section className="py-20 border-t border-brand-900/40 bg-brand-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Entre em Contato
        </h2>
        <p className="text-brand-100/65 text-lg mb-10 max-w-xl mx-auto">
          Pronto para impulsionar sua próxima transformação digital? Fale com um de nossos consultores.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          <a href="tel:+5521975542783" className="flex items-center gap-3 border border-brand-800 bg-brand-900/20 hover:border-brand-600 rounded-2xl p-4 w-full sm:w-auto px-8 transition-all">
            <span className="text-xl">📞</span>
            <div className="text-left">
              <p className="text-xs text-brand-400">Telefone / WhatsApp</p>
              <p className="text-sm font-bold text-white">(21) 97554-2783</p>
            </div>
          </a>
          <a href="mailto:contato.cpxlabs@gmail.com" className="flex items-center gap-3 border border-brand-800 bg-brand-900/20 hover:border-brand-600 rounded-2xl p-4 w-full sm:w-auto px-8 transition-all">
            <span className="text-xl">📧</span>
            <div className="text-left">
              <p className="text-xs text-brand-400">E-mail</p>
              <p className="text-sm font-bold text-white">contato.cpxlabs@gmail.com</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
