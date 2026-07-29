export type ServiceType = "single-production" | "single-post" | "ep-album" | "other";

export interface ServiceOption {
  id: ServiceType;
  label: string;
  description: string;
  price: number;
  isPerTrack?: boolean;
}

export interface ContractFormData {
  // Step 1 - Personal
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  nomeArtistico: string;

  // Step 2 - Service
  servico: ServiceType;
  escopoDetalhado: string;
  numFaixas: number;
  prazoDesejado: string;
  formaPagamento: string;
  outrasCondicoes: string;

  // Step 3 - Terms
  aceiteTermos: boolean;
  aceiteLGPD: boolean;
}

export interface GovUserInfo {
  sub: string;
  name: string;
  cpf: string;
  email: string;
}

export interface SignedContract {
  protocolo: string;
  signerName: string;
  signerCpf: string;
  signerEmail: string;
  signedAt: string;
  servico: string;
  valor: number;
}
