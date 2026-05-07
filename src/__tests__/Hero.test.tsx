import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("renders the main headline", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Transformando negócios/i)
    ).toBeInTheDocument();
  });

  it("renders the sub-headline description", () => {
    render(<Hero />);
    expect(
      screen.getByText(/parceiro estratégico em inovação tecnológica/i)
    ).toBeInTheDocument();
  });

  it("renders the 'Nossos Serviços' CTA link", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /Nossos Serviços/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#servicos");
  });

  it("renders the 'Fale Conosco' CTA link", () => {
    render(<Hero />);
    const links = screen.getAllByRole("link", { name: /Fale Conosco/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "#contato");
  });

  it("renders all four statistics", () => {
    render(<Hero />);
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("30+")).toBeInTheDocument();
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("99%")).toBeInTheDocument();
  });

  it("renders the badge text", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Consultoria em TI de Alta Performance/i)
    ).toBeInTheDocument();
  });
});
