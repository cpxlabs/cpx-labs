"use client";

import { useState } from "react";
import type { ContactPayload } from "@/lib/contact";

export default function ContactForm() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    subject: "",
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-scale-in">
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
          onClick={() => { setSubmitted(false); setError(null); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="mt-6 rounded-full border border-brand-600 px-5 py-2 text-sm font-medium text-brand-300 transition-all hover:bg-brand-800 hover:text-white"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
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
            className="w-full rounded-xl border border-brand-700 bg-brand-800/50 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-all duration-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 focus:outline-none"
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
            className="w-full rounded-xl border border-brand-700 bg-brand-800/50 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-all duration-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-100/82">
          Assunto
        </label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Como podemos ajudar?"
          className="w-full rounded-xl border border-brand-700 bg-brand-800/50 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-all duration-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 focus:outline-none"
        />
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
          placeholder="Descreva seu projeto..."
          className="w-full resize-none rounded-xl border border-brand-700 bg-brand-800/50 px-4 py-3 text-sm text-white placeholder-brand-100/40 transition-all duration-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="brand-glow w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando…
          </>
        ) : (
          "Falar com um Especialista"
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
      )}
    </form>
  );
}
