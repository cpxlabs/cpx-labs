"use client";

import { useState } from "react";
import type { ContactPayload } from "@/app/api/contact/route";

const contactInfo = [
  {
    icon: "📧",
    title: "E-mail",
    value: "contato.cpxlabs@gmail.com",
    href: "mailto:contato.cpxlabs@gmail.com",
  },
  {
    icon: "📞",
    title: "Telefone / WhatsApp",
    value: "(21) 97554-2783",
    href: "https://wa.me/5521975542783",
  },
  {
    icon: "📍",
    title: "Localização",
    value: "Rio de Janeiro, RJ — Ramos, Complexo do Alemão",
    href: "https://maps.google.com/?q=Ramos+Complexo+do+Alemão+Rio+de+Janeiro+RJ",
  },
  {
    icon: "⏰",
    title: "Horário de Atendimento",
    value: "Seg–Sex: 09h às 18h",
    href: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Erro ao enviar mensagem."
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contato"
      className="bg-[linear-gradient(180deg,var(--brand-950)_0%,var(--brand-900)_100%)] py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="mb-4 inline-block rounded-full border border-brand-400/30 bg-brand-500/12 px-4 py-1.5 text-sm font-semibold text-brand-100">
            Entre em contato
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Vamos conversar sobre o seu projeto
          </h2>
          <p className="text-brand-100/72 text-lg max-w-2xl mx-auto">
            Preencha o formulário ou utilize nossos canais de contato. Nossa
            equipe responde em até 24 horas úteis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-brand-800 bg-brand-900/85 p-5"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="text-sm text-brand-100/68">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-semibold text-white transition-colors hover:text-brand-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-brand-800 bg-brand-900/85 p-5">
              <p className="mb-3 text-sm text-brand-100/68">Redes Sociais</p>
              <div className="flex gap-3">
                {[
                  { label: "LinkedIn", href: "https://linkedin.com/company/cpxlabs" },
                  { label: "GitHub", href: "https://github.com/cpxlabs" },
                  { label: "Instagram", href: "https://instagram.com/cpxlabs" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-brand-800 px-3 py-1.5 text-sm font-medium text-brand-100/82 transition-all hover:bg-brand-500 hover:text-white"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-800 bg-brand-900/85 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/16">
                  <svg
                    className="h-8 w-8 text-brand-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Mensagem enviada!
                </h3>
                <p className="text-brand-100/72">
                  Obrigado pelo contato. Nossa equipe retornará em breve.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setError(null); }}
                  className="mt-6 text-sm font-medium text-brand-300 hover:text-brand-200"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-brand-700 bg-brand-800/78 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-colors focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                      className="w-full rounded-xl border border-brand-700 bg-brand-800/78 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-colors focus:border-brand-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Nome da sua empresa"
                    className="w-full rounded-xl border border-brand-700 bg-brand-800/78 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-colors focus:border-brand-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
                    Serviço de interesse
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-brand-700 bg-brand-800/78 px-4 py-3 text-sm text-white transition-colors focus:border-brand-400 focus:outline-none"
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="desenvolvimento">Desenvolvimento de Software</option>
                    <option value="cloud">Cloud & Infraestrutura</option>
                    <option value="seguranca">Segurança da Informação</option>
                    <option value="dados">Business Intelligence & Dados</option>
                    <option value="ia">Inteligência Artificial</option>
                    <option value="consultoria">Consultoria & Arquitetura</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Descreva brevemente o seu projeto ou necessidade..."
                    className="w-full resize-none rounded-xl border border-brand-700 bg-brand-800/78 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-colors focus:border-brand-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="brand-glow w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Enviando…" : "Enviar Mensagem"}
                </button>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
