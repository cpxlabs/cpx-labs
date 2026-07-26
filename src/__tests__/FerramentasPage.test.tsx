import { render, screen } from "@testing-library/react";
import FerramentasPage from "@/app/ferramentas/page";

describe("FerramentasPage", () => {
  it("renders the page heading", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
  });

  it("renders the featured tool card", () => {
    render(<FerramentasPage />);
    const assistantElements = screen.getAllByText("CV Smart Assistant");
    expect(assistantElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });

  it("renders the planned tools section", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Em Breve")).toBeInTheDocument();
  });

  it("renders the 'Falar com Consultor' CTA", () => {
    render(<FerramentasPage />);
    const links = screen.getAllByRole("link", { name: /Falar com Consultor/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});
