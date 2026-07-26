import { render, screen } from "@testing-library/react";
import Services from "@/components/Services";

describe("Services", () => {
  it("renders the section heading", () => {
    render(<Services />);
    expect(screen.getByText(/Serviços Especializados de TI/i)).toBeInTheDocument();
  });

  it("renders the section description", () => {
    render(<Services />);
    expect(
      screen.getByText(/Arquitetura e desenvolvimento digital sob medida para você/i)
    ).toBeInTheDocument();
  });

  it("renders all six service cards", () => {
    render(<Services />);
    const expectedTitles = [
      /Desenvolvimento de Software/i,
      /Computação em Nuvem/i,
      /Cibersegurança/i,
      /Business Intelligence/i,
      /Inteligência Artificial/i,
      /Consultoria Estratégica de TI/i,
    ];
    for (const title of expectedTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders technology tags", () => {
    render(<Services />);
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS/i)).toBeInTheDocument();
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
  });
});
