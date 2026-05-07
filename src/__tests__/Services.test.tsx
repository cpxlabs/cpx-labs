import { render, screen } from "@testing-library/react";
import Services from "@/components/Services";

describe("Services", () => {
  it("renders the section heading", () => {
    render(<Services />);
    expect(screen.getByText(/Nossas Soluções em TI/i)).toBeInTheDocument();
  });

  it("renders the section label badge", () => {
    render(<Services />);
    expect(screen.getByText(/O que fazemos/i)).toBeInTheDocument();
  });

  it("renders all six service cards", () => {
    render(<Services />);
    const expectedTitles = [
      /Desenvolvimento de Software/i,
      /Cloud & Infraestrutura/i,
      /Segurança da Informação/i,
      /Business Intelligence & Dados/i,
      /Inteligência Artificial/i,
      /Consultoria & Arquitetura/i,
    ];
    for (const title of expectedTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders key technology highlights", () => {
    render(<Services />);
    expect(screen.getByText(/React \/ Next\.js/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS \/ Azure \/ GCP/i)).toBeInTheDocument();
    expect(screen.getByText(/LGPD \/ Compliance/i)).toBeInTheDocument();
  });

  it("renders the section description paragraph", () => {
    render(<Services />);
    expect(
      screen.getByText(/portfólio completo de serviços tecnológicos/i)
    ).toBeInTheDocument();
  });
});
