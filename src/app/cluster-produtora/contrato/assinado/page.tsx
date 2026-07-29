"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CLUSTER_SERVICES } from "@/lib/cluster/constants";
import type { ContractFormData, ServiceType } from "@/lib/cluster/types";

interface ContractResult {
  protocolo: string;
  signerName: string;
  signerEmail: string;
  signedAt: string;
  emailSent: boolean;
}

function AssinadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [result, setResult] = useState<ContractResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/cluster-produtora/contrato");
      return;
    }

    async function generateContract() {
      try {
        const personalData = JSON.parse(sessionStorage.getItem("contract-personal") || "{}");
        const serviceData = JSON.parse(sessionStorage.getItem("contract-service") || "{}");

        const formData: ContractFormData = {
          ...personalData,
          ...serviceData,
          servico: serviceData.servico as ServiceType,
          numFaixas: serviceData.numFaixas || 1,
        };

        const response = await fetch("/api/cluster/contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData, token }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erro ao gerar contrato");
        }

        const data: ContractResult = await response.json();
        setResult(data);

        sessionStorage.removeItem("contract-personal");
        sessionStorage.removeItem("contract-service");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao gerar contrato");
      } finally {
        setLoading(false);
      }
    }

    generateContract();
  }, [token, router]);

  if (loading) {
    return (
      <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-200/70">Gerando seu contrato...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="rounded-xl border border-red-800 bg-red-900/30 p-8">
            <p className="text-red-300 text-lg font-bold mb-2">Erro ao gerar contrato</p>
            <p className="text-red-200/70 text-sm mb-6">{error}</p>
            <Link
              href="/cluster-produtora/contrato"
              className="inline-block bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all"
            >
              Tentar novamente
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const servico = CLUSTER_SERVICES.find(s => {
    const data = JSON.parse(sessionStorage.getItem("contract-service") || "{}");
    return s.id === data.servico;
  });

  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Contato assinado com sucesso!
        </h1>
        <p className="text-brand-200/70 mb-8">
          Seu contrato de produção musical foi assinado eletronicamente via GOV.br
        </p>

        {result && (
          <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-6 text-left space-y-3 mb-8">
            <div className="flex justify-between py-2 border-b border-brand-800">
              <span className="text-brand-200/70 text-sm">Protocolo</span>
              <span className="text-brand-400 font-mono font-bold">{result.protocolo}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-brand-800">
              <span className="text-brand-200/70 text-sm">Contratante</span>
              <span className="text-white font-medium">{result.signerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-brand-800">
              <span className="text-brand-200/70 text-sm">E-mail</span>
              <span className="text-white">{result.signerEmail}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-brand-800">
              <span className="text-brand-200/70 text-sm">Data</span>
              <span className="text-white">
                {new Date(result.signedAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(result.signedAt).toLocaleTimeString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-brand-200/70 text-sm">E-mail enviado</span>
              <span className={result.emailSent ? "text-green-400" : "text-brand-400/70"}>
                {result.emailSent ? "Sim" : "Não (configure Resend na produção)"}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cluster-produtora"
            className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97]"
          >
            Voltar ao site
          </Link>
          <Link
            href="/contato"
            className="border border-brand-700 hover:border-brand-500 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all"
          >
            Falar conosco
          </Link>
        </div>

        <p className="text-brand-400/50 text-xs mt-8">
          Uma cópia do contrato foi enviada para {result?.signerEmail}
        </p>
      </div>
    </section>
  );
}

export default function AssinadoPage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-200/70">Carregando...</p>
        </div>
      </section>
    }>
      <AssinadoContent />
    </Suspense>
  );
}
