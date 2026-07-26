import { render, screen } from "@testing-library/react";
import ServicosPage from "@/app/servicos/page";

describe("ServicosPage", () => {
  it("renders the page heading", () => {
    render(<ServicosPage />);
    expect(screen.getByText(/Nossos Serviços/i)).toBeInTheDocument();
  });

  it("renders all five service cards", () => {
    render(<ServicosPage />);
    expect(screen.getByText("Inteligência Artificial")).toBeInTheDocument();
    expect(screen.getByText("Cloud Computing")).toBeInTheDocument();
    expect(screen.getByText("Cyber Security")).toBeInTheDocument();
    expect(screen.getByText("Software Development")).toBeInTheDocument();
    expect(screen.getByText("Business Intelligence")).toBeInTheDocument();
  });

  it("renders the consulting banner", () => {
    render(<ServicosPage />);
    expect(screen.getByText(/Consultoria Estratégica em TI/i)).toBeInTheDocument();
  });

  it("renders the 'Falar com Consultor' CTA", () => {
    render(<ServicosPage />);
    const links = screen.getAllByRole("link", { name: /Falar com Consultor/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});
