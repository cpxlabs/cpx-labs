"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { CLUSTER_SERVICES, UF_LIST, PAYMENT_OPTIONS, formatPrice } from "@/lib/cluster/constants";
import type { ContractFormData, ServiceType } from "@/lib/cluster/types";

const personalSchema = z.object({
  nome: z.string().min(3, "Mínimo de 3 caracteres"),
  cpfCnpj: z.string().min(11, "Informe CPF ou CNPJ"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(5, "Endereço inválido"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  uf: z.string().length(2, "Selecione uma UF"),
  cep: z.string().min(8, "CEP inválido"),
  nomeArtistico: z.string().optional(),
});

const serviceSchema = z.object({
  servico: z.string().min(1, "Selecione um serviço"),
  escopoDetalhado: z.string().optional(),
  numFaixas: z.number().min(2).optional(),
  prazoDesejado: z.string().optional(),
  formaPagamento: z.string().min(1, "Selecione uma forma de pagamento"),
  outrasCondicoes: z.string().optional(),
});

const termsSchema = z.object({
  aceiteTermos: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar os termos" }) }),
  aceiteLGPD: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar a política de privacidade" }) }),
});

type PersonalData = z.infer<typeof personalSchema>;
type ServiceData = z.infer<typeof serviceSchema>;
type TermsData = z.infer<typeof termsSchema>;

export default function ContratoPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("contract-personal") || "{}")
      : {},
  });

  const serviceForm = useForm<ServiceData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("contract-service") || "{}")
      : {},
  });

  const termsForm = useForm<TermsData>({
    resolver: zodResolver(termsSchema),
  });

  const handlePersonalSubmit = (data: PersonalData) => {
    sessionStorage.setItem("contract-personal", JSON.stringify(data));
    setStep(2);
  };

  const handleServiceSubmit = (data: ServiceData) => {
    sessionStorage.setItem("contract-service", JSON.stringify(data));
    setStep(3);
  };

  const servicoSelecionado = CLUSTER_SERVICES.find(
    s => s.id === serviceForm.watch("servico")
  );

  const allData: ContractFormData = {
    ...personalForm.watch(),
    ...serviceForm.watch(),
    ...termsForm.watch(),
    servico: serviceForm.watch("servico") as ServiceType,
    numFaixas: serviceForm.watch("numFaixas") || 1,
  } as ContractFormData;

  const totalValue = allData.servico === "ep-album"
    ? (servicoSelecionado?.price || 400) * (allData.numFaixas || 1)
    : servicoSelecionado?.price || 0;

  const handleSign = async () => {
    const termsValid = await termsForm.trigger();
    if (!termsValid) return;

    setIsSubmitting(true);
    setError("");

    sessionStorage.setItem("contract-personal", JSON.stringify(personalForm.getValues()));
    sessionStorage.setItem("contract-service", JSON.stringify(serviceForm.getValues()));

    window.location.href = "/api/cluster/gov-login";
  };

  const stepIndicator = (num: number, label: string) => (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        step >= num ? "bg-brand-500 text-white" : "bg-brand-800/50 text-brand-400/50"
      }`}>
        {num}
      </div>
      <span className={`text-sm hidden sm:inline ${step >= num ? "text-white" : "text-brand-400/50"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <section className="min-h-screen bg-brand-950 pt-28 pb-24 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-brand-400 font-mono mb-2">
            Cluster Produtora
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Solicitar Serviço
          </h1>
          <p className="text-brand-200/70 mt-2 text-sm">
            Preencha os dados abaixo para gerar seu contrato de produção musical
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10">
          {stepIndicator(1, "Dados Pessoais")}
          <div className="h-px w-8 sm:w-16 bg-brand-800" />
          {stepIndicator(2, "Dados do Serviço")}
          <div className="h-px w-8 sm:w-16 bg-brand-800" />
          {stepIndicator(3, "Revisão")}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-5">
            <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-6 space-y-5">
              <h2 className="text-lg font-bold text-brand-400 font-mono text-sm uppercase tracking-wide">
                Dados Pessoais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nome completo / Razão Social *</label>
                  <input {...personalForm.register("nome")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Seu nome" />
                  {personalForm.formState.errors.nome && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.nome.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CPF / CNPJ *</label>
                  <input {...personalForm.register("cpfCnpj")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="000.000.000-00" />
                  {personalForm.formState.errors.cpfCnpj && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.cpfCnpj.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">E-mail *</label>
                  <input {...personalForm.register("email")} type="email" className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="email@exemplo.com" />
                  {personalForm.formState.errors.email && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefone / WhatsApp *</label>
                  <input {...personalForm.register("telefone")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="(21) 99999-9999" />
                  {personalForm.formState.errors.telefone && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.telefone.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Endereço *</label>
                  <input {...personalForm.register("endereco")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Rua, Avenida..." />
                  {personalForm.formState.errors.endereco && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.endereco.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nº *</label>
                  <input {...personalForm.register("numero")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" />
                  {personalForm.formState.errors.numero && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.numero.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Complemento</label>
                  <input {...personalForm.register("complemento")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bairro *</label>
                  <input {...personalForm.register("bairro")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" />
                  {personalForm.formState.errors.bairro && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.bairro.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <input {...personalForm.register("cidade")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" />
                  {personalForm.formState.errors.cidade && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.cidade.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">UF *</label>
                  <select {...personalForm.register("uf")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors">
                    <option value="">Selecione</option>
                    {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                  {personalForm.formState.errors.uf && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.uf.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CEP *</label>
                  <input {...personalForm.register("cep")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="00000-000" />
                  {personalForm.formState.errors.cep && <p className="text-red-400 text-xs mt-1">{personalForm.formState.errors.cep.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nome artístico / Marca</label>
                  <input {...personalForm.register("nomeArtistico")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Opcional" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97]">
                Próximo &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={serviceForm.handleSubmit(handleServiceSubmit)} className="space-y-5">
            <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-6 space-y-5">
              <h2 className="text-lg font-bold text-brand-400 font-mono text-sm uppercase tracking-wide">
                Dados do Serviço
              </h2>

              <div>
                <label className="block text-sm font-medium mb-3">Tipo de Serviço *</label>
                <div className="space-y-3">
                  {CLUSTER_SERVICES.map(service => (
                    <label key={service.id} className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      serviceForm.watch("servico") === service.id
                        ? "border-brand-500 bg-brand-500/10"
                        : "border-brand-800 bg-brand-950/50 hover:border-brand-700"
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          value={service.id}
                          checked={serviceForm.watch("servico") === service.id}
                          onChange={() => serviceForm.setValue("servico", service.id)}
                          className="mt-0.5 accent-brand-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{service.label}</p>
                          <p className="text-brand-200/60 text-xs mt-0.5">{service.description}</p>
                          {service.price > 0 && (
                            <p className="text-brand-400 text-xs font-bold mt-1">
                              {service.isPerTrack ? `R$ ${service.price},00/faixa` : formatPrice(service.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {serviceForm.formState.errors.servico && <p className="text-red-400 text-xs mt-1">{serviceForm.formState.errors.servico.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Escopo detalhado</label>
                <textarea {...serviceForm.register("escopoDetalhado")} rows={3} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Descreva detalhes do seu projeto..." />
              </div>

              {serviceForm.watch("servico") === "ep-album" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Número de faixas *</label>
                  <input {...serviceForm.register("numFaixas", { valueAsNumber: true })} type="number" min={2} className="w-32 bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  {serviceForm.formState.errors.numFaixas && <p className="text-red-400 text-xs mt-1">{serviceForm.formState.errors.numFaixas.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Prazo desejado</label>
                <input {...serviceForm.register("prazoDesejado")} type="date" className="w-full sm:w-auto bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Forma de pagamento *</label>
                <select {...serviceForm.register("formaPagamento")} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors">
                  <option value="">Selecione</option>
                  {PAYMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {serviceForm.formState.errors.formaPagamento && <p className="text-red-400 text-xs mt-1">{serviceForm.formState.errors.formaPagamento.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Outras condições</label>
                <textarea {...serviceForm.register("outrasCondicoes")} rows={2} className="w-full bg-brand-950 border border-brand-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-brand-400/40 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Ex: parcelamento em 3x, desconto..." />
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-brand-300 hover:text-brand-200 text-sm font-medium transition-colors">
                &larr; Voltar
              </button>
              <button type="submit" className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97]">
                Revisar &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-brand-400 font-mono text-sm uppercase tracking-wide">
                Revisão do Contrato
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-brand-300 mb-2">Dados Pessoais</h3>
                  <div className="grid grid-cols-2 gap-2 text-brand-200/80">
                    <p>Nome: <span className="text-white">{personalForm.watch("nome")}</span></p>
                    <p>CPF/CNPJ: <span className="text-white">{personalForm.watch("cpfCnpj")}</span></p>
                    <p>E-mail: <span className="text-white">{personalForm.watch("email")}</span></p>
                    <p>Telefone: <span className="text-white">{personalForm.watch("telefone")}</span></p>
                    <p className="col-span-2">Endereço: <span className="text-white">{personalForm.watch("endereco")}, {personalForm.watch("numero")}</span></p>
                    <p className="col-span-2">Cidade: <span className="text-white">{personalForm.watch("cidade")} - {personalForm.watch("uf")}</span></p>
                  </div>
                </div>

                <div className="border-t border-brand-800 pt-4">
                  <h3 className="font-semibold text-brand-300 mb-2">Serviço</h3>
                  <div className="grid grid-cols-2 gap-2 text-brand-200/80">
                    <p>Tipo: <span className="text-white">{servicoSelecionado?.label}</span></p>
                    <p>Valor: <span className="text-white font-bold">{formatPrice(totalValue)}</span></p>
                    {serviceForm.watch("escopoDetalhado") && (
                      <p className="col-span-2">Escopo: <span className="text-white">{serviceForm.watch("escopoDetalhado")}</span></p>
                    )}
                    <p>Pagamento: <span className="text-white">{PAYMENT_OPTIONS.find(o => o.value === serviceForm.watch("formaPagamento"))?.label}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="rounded-xl border border-brand-800 bg-brand-900/50 p-6 space-y-4">
                <h2 className="text-lg font-bold text-brand-400 font-mono text-sm uppercase tracking-wide">
                  Termos
                </h2>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...termsForm.register("aceiteTermos")} className="mt-0.5 accent-brand-500" />
                  <span className="text-sm text-brand-200/80">
                    Li e concordo com os <Link href="/cluster-produtora" className="text-brand-400 underline">termos de serviço</Link> da Cluster Produtora *
                  </span>
                </label>
                {termsForm.formState.errors.aceiteTermos && <p className="text-red-400 text-xs ml-7">{termsForm.formState.errors.aceiteTermos.message}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...termsForm.register("aceiteLGPD")} className="mt-0.5 accent-brand-500" />
                  <span className="text-sm text-brand-200/80">
                    Autorizo o tratamento dos meus dados conforme a LGPD *
                  </span>
                </label>
                {termsForm.formState.errors.aceiteLGPD && <p className="text-red-400 text-xs ml-7">{termsForm.formState.errors.aceiteLGPD.message}</p>}
              </div>

              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep(2)} className="text-brand-300 hover:text-brand-200 text-sm font-medium transition-colors">
                  &larr; Voltar
                </button>
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-spring brand-glow active:scale-[0.97] flex items-center gap-2"
                >
                  {isSubmitting ? "Redirecionando..." : "Assinar com GOV.br"}
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="text-center text-brand-400/50 text-xs mt-8">
          Seus dados estão seguros e serão usados apenas para gerar o contrato
        </p>
      </div>
    </section>
  );
}
