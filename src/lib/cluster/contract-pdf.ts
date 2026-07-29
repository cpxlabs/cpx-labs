import { jsPDF } from "jspdf";
import type { ContractFormData, ServiceOption } from "./types";
import { CLUSTER_SERVICES, formatPrice, generateProtocol } from "./constants";

export function generateContractPdf(
  data: ContractFormData,
  signerName: string,
  signerCpf: string,
  protocolo: string
): Buffer {
  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = 210;
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  function addText(text: string, opts?: { bold?: boolean; size?: number; align?: "left" | "center" | "right"; color?: [number, number, number] }) {
    const font = opts?.bold ? "Helvetica-Bold" : "Helvetica";
    const size = opts?.size || 10;
    const align = opts?.align || "left";
    doc.setFont(font, "normal");
    doc.setFontSize(size);
    if (opts?.color) doc.setTextColor(...opts.color);
    else doc.setTextColor(0);
    doc.text(text, align === "center" ? pageWidth / 2 : margin, y, { align });
  }

  function addLine() {
    y += 2;
    doc.setDrawColor(0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  }

  function checkPage() {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
  }

  // Header
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("CPX LABS · CLUSTER PRODUTORA", pageWidth / 2, y, { align: "center" });
  y += 6;
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO MUSICAL", pageWidth / 2, y, { align: "center" });
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Nº do Contrato: ${protocolo} · Data: ${new Date().toLocaleDateString("pt-BR")} · Local: Rio de Janeiro/RJ`, pageWidth / 2, y, { align: "center" });
  y += 6;
  addLine();

  // Part I
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("PARTE I · DADOS DAS PARTES", margin, y);
  y += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("CONTRATADA (PRESTADORA): CLUSTER PRODUTORA, braço do CPX LABS, sediada em Rio de Janeiro/RJ.", margin, y);
  y += 4;
  doc.text("Equipe técnica: Prince' Gutt (multi-instrumentista · produção instrumental e edição) e", margin, y);
  y += 4;
  doc.text("Az1nn (multi-instrumentista · engenharia de mixagem e masterização).", margin, y);
  y += 6;

  doc.setFont("Helvetica-Bold", "normal");
  doc.text("CONTRATANTE (CLIENTE):", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.text(`Nome: ${data.nome}`, margin, y);
  y += 4;
  doc.text(`CPF/CNPJ: ${data.cpfCnpj}`, margin, y);
  y += 4;
  doc.text(`Endereço: ${data.endereco}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ""}`, margin, y);
  y += 4;
  doc.text(`Bairro: ${data.bairro} · Cidade: ${data.cidade} · UF: ${data.uf}`, margin, y);
  y += 4;
  doc.text(`CEP: ${data.cep} · Telefone: ${data.telefone} · E-mail: ${data.email}`, margin, y);
  y += 4;
  if (data.nomeArtistico) {
    doc.text(`Nome artístico / Marca: ${data.nomeArtistico}`, margin, y);
    y += 4;
  }
  y += 2;
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("As partes acima identificadas têm entre si, justo e acordado o presente contrato, nos termos das cláusulas abaixo.", margin, y);
  y += 6;

  // Clause 1
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 1 · OBJETO", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);
  const servico = CLUSTER_SERVICES.find(s => s.id === data.servico);
  const servicoDesc = servico?.label || data.servico;
  const faixasStr = data.servico === "ep-album" ? ` (${data.numFaixas} faixas)` : "";
  doc.text(`O presente contrato tem como objeto a prestação de serviços de produção musical pela`, margin, y);
  y += 4;
  doc.text(`CONTRATADA ao CONTRATANTE, na modalidade: ${servicoDesc}${faixasStr}.`, margin, y);
  y += 6;

  if (data.escopoDetalhado) {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(80);
    const lines = doc.splitTextToSize(`Escopo detalhado: ${data.escopoDetalhado}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 4 + 4;
  }

  // Clause 2 - simplified scope
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 2 · ESCOPO TÉCNICO", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);
  const scopeText = [
    "1. Pré-produção: Criação do instrumental a partir de guia (voz ou type beat).",
    "2. Sessão de gravação: Realizada com instrumental mínimo 60% estruturado. Inclui vocal comping e",
    "   limpeza de ruídos digitais. Entrega de Rough Mix com efeitos e loudness de mercado.",
    "3. Pós-produção: Edição fina, afinação precisa, limpeza de respirações e sibilâncias, mixagem e",
    "   masterização.",
    "4. Prazo: 15 a 30 dias corridos por faixa, contados da aprovação da gravação.",
    "5. Ajustes: Até 2 sessões de recall incluídas. Excedido este limite, taxas adicionais conforme escopo.",
  ];
  scopeText.forEach(line => {
    doc.text(line, margin, y);
    y += 4;
  });
  y += 3;

  // Clause 3
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 3 · VALOR E CONDIÇÕES DE PAGAMENTO", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);

  const totalValue = data.servico === "ep-album"
    ? (servico?.price || 400) * (data.numFaixas || 1)
    : servico?.price || data.servico === "other" ? 0 : 600;

  doc.text(`3.1 Valor total do contrato: ${formatPrice(totalValue)}.`, margin, y);
  y += 4;
  doc.text("3.2 Valores referenciais: Produção de Single R$ 600,00 · Pós-Produção de Single R$ 400,00 ·", margin, y);
  y += 4;
  doc.text("    EP/Álbum: R$ 400,00 por faixa.", margin, y);
  y += 4;
  doc.text(`3.3 Forma de pagamento: ${data.formaPagamento || "A combinar"}.`, margin, y);
  y += 4;
  if (data.outrasCondicoes) {
    doc.text(`    Outras condições: ${data.outrasCondicoes}`, margin, y);
    y += 4;
  }
  doc.text("3.4 O início dos serviços fica condicionado à confirmação do pagamento da entrada ou do valor total.", margin, y);
  y += 6;

  // Clause 4
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 4 · ARQUIVOS ENTREGUES", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Após aprovação final e quitação, serão entregues via WeTransfer ou e-mail:", margin, y);
  y += 4;
  [
    "1. Master final em WAV 24bit/48kHz e MP3 320kbps;",
    "2. Stems completos (Bandlab/Moisés AI): Voz Lead · Backing Vocals · Drums · Bass · Others;",
    "3. Click Track (metrônomo), mediante solicitação prévia do CONTRATANTE.",
  ].forEach(line => {
    doc.text(line, margin, y);
    y += 4;
  });
  y += 3;

  // Clause 5
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 5 · OBRIGAÇÕES DAS PARTES", margin, y);
  y += 5;
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(9);
  doc.text("5.1 Da CONTRATADA:", margin, y);
  y += 4;
  doc.setFont("Helvetica", "normal");
  ["- Cumprir escopo técnico e prazos;", "- Utilizar equipamentos de padrão profissional;", "- Manter sigilo sobre o material do CONTRATANTE."].forEach(line => {
    doc.text(line, margin + 5, y);
    y += 4;
  });
  doc.setFont("Helvetica-Bold", "normal");
  doc.text("5.2 Do CONTRATANTE:", margin, y);
  y += 4;
  doc.setFont("Helvetica", "normal");
  ["- Comparecer às sessões nas datas acordadas;", "- Fornecer materiais e referências em tempo hábil;", "- Solicitar ajustes conforme regra da Cláusula 2;", "- Quitar os valores nas datas acordadas."].forEach(line => {
    doc.text(line, margin + 5, y);
    y += 4;
  });
  y += 2;

  // Clause 6
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 6 · PROPRIEDADE INTELECTUAL", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("6.1 Todos os direitos autorais e fonográficos pertencem integralmente ao CONTRATANTE,", margin, y);
  y += 4;
  doc.text("    após quitação total do valor do contrato.", margin, y);
  y += 4;
  doc.text("6.2 A CONTRATADA reserva-se o direito de utilizar as obras para fins de portfólio e", margin, y);
  y += 4;
  doc.text("    divulgação técnica, sempre com crédito ao artista/marca.", margin, y);
  y += 6;

  // Clause 7
  checkPage();
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(138, 43, 13);
  doc.text("CLÁUSULA 7 · RESCISÃO · FORO · DISPOSIÇÕES GERAIS", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  [
    "7.1 Rescisão antes do início: devolução de 70% do valor pago. Após início: retenção proporcional.",
    "7.2 A CONTRATADA não se responsabiliza por atrasos decorrentes de materiais não entregues pelo",
    "    CONTRATANTE ou força maior.",
    "7.3 Este contrato integra o Termo Técnico de Serviços da Cluster Produtora.",
    "7.4 Fica eleito o Foro da Comarca do Rio de Janeiro/RJ para dirimir dúvidas deste contrato.",
  ].forEach(line => {
    doc.text(line, margin, y);
    y += 4;
  });
  y += 6;

  // Signature block
  checkPage();
  addLine();
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(80);
  const finalText = "E, por estarem assim justos e contratados, assinam o presente instrumento eletrônico.";
  doc.text(finalText, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Signer
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("CONTRATANTE", margin, y);
  y += 2;
  doc.line(margin, y, margin + 70, y);
  y += 1;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Assinatura eletrônica via GOV.br`, margin, y);
  y += 3;
  doc.text(`${signerName}`, margin, y);
  y += 3;
  doc.text(`CPF: ${signerCpf} · Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, y);
  y += 8;

  // Contractor
  doc.setFont("Helvetica-Bold", "normal");
  doc.setFontSize(10);
  doc.text("CONTRATADA · CLUSTER PRODUTORA / CPX LABS", margin + 80, y);
  y += 2;
  doc.line(margin + 80, y, margin + 150, y);
  y += 1;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Prince' Gutt (Produtor)", margin + 80, y);
  y += 3;
  doc.text("Az1nn (Engenheiro)", margin + 80, y);
  y += 3;
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin + 80, y);
  y += 10;

  // Protocol footer
  addLine();
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120);
  doc.text(`Protocolo: ${protocolo} · Assinado eletronicamente via GOV.br · ${new Date().toISOString()}`, pageWidth / 2, y, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
