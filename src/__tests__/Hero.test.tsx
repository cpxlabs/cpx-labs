import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("renders the main headline", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Engenharia de Precisão para/i)
    ).toBeInTheDocument();
  });

  it("renders the sub-headline description", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Custom software development/i)
    ).toBeInTheDocument();
  });

  it("renders the 'Começar' CTA link", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /Começar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/servicos");
  });

  it("renders the 'Falar com Consultor' CTA link", () => {
    render(<Hero />);
    const links = screen.getAllByRole("link", { name: /Falar com Consultor/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/contato");
  });

  it("renders all three statistics", () => {
    render(<Hero />);
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("10+")).toBeInTheDocument();
  });

  it("renders stat labels", () => {
    render(<Hero />);
    expect(screen.getByText(/Projetos Entregues/i)).toBeInTheDocument();
    expect(screen.getByText(/Taxa de Sucesso/i)).toBeInTheDocument();
    expect(screen.getByText(/Anos de Experiência/i)).toBeInTheDocument();
  });

  it("renders the gradient 'Transformação Digital' span", () => {
    render(<Hero />);
    expect(screen.getByText("Transformação Digital")).toBeInTheDocument();
  });
});
