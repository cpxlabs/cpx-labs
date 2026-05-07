"use client";

import { useState } from "react";
import type { ContactPayload } from "@/app/api/contact/route";

const contactInfo = [
  {
    icon: "📧",
    title: "E-mail",
    value: "contato@cpxlabs.com.br",
    href: "mailto:contato@cpxlabs.com.br",
  },
  {
    icon: "📞",
    title: "Telefone / WhatsApp",
    value: "+55 (11) 9 9999-9999",
    href: "https://wa.me/5511999999999",
  },
  {
    icon: "📍",
    title: "Localização",
    value: "São Paulo, SP — Brasil",
    href: "https://maps.google.com/?q=São+Paulo+SP",
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
    <section id="contato" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Entre em contato
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Vamos conversar sobre o seu projeto
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Preencha o formulário ou utilize nossos canais de contato. Nossa
            equipe responde em até 24 horas úteis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 bg-slate-800 rounded-xl border border-slate-700"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="text-slate-400 text-sm">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-white font-semibold hover:text-sky-400 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm mb-3">Redes Sociais</p>
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
                    className="px-3 py-1.5 bg-slate-700 hover:bg-sky-500 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-400"
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
                <p className="text-slate-400">
                  Obrigado pelo contato. Nossa equipe retornará em breve.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setError(null); }}
                  className="mt-6 text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Nome da sua empresa"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Serviço de interesse
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
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
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Descreva brevemente o seu projeto ou necessidade..."
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-sky-500/25"
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
