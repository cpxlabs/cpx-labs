import type { ServiceOption } from "./types";

export const CLUSTER_SERVICES: ServiceOption[] = [
  {
    id: "single-production",
    label: "Produção de Single Completo",
    description: "Instrumental + gravação de voz + edição + mixagem + masterização",
    price: 600,
  },
  {
    id: "single-post",
    label: "Pós-Produção de Single",
    description: "Edição + mixagem + masterização (gravação já existente)",
    price: 400,
  },
  {
    id: "ep-album",
    label: "EP / Álbum",
    description: "Escopo completo de Single por faixa · Identidade sonora unificada",
    price: 400,
    isPerTrack: true,
  },
  {
    id: "other",
    label: "Outro",
    description: "Escopo personalizado a combinar",
    price: 0,
  },
];

export const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export const PAYMENT_OPTIONS = [
  { value: "avista", label: "À vista" },
  { value: "entrada50", label: "50% entrada + 50% na aprovação final" },
  { value: "parcelado", label: "Parcelado" },
  { value: "mercadolivre", label: "Mercado Livre (taxas adicionais)" },
];

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function generateProtocol(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CLU-${result}`;
}
