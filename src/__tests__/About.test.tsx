import { render, screen } from "@testing-library/react";
import About from "@/components/About";

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(screen.getByText(/Quem Somos/i)).toBeInTheDocument();
  });

  it("renders the section label badge", () => {
    render(<About />);
    expect(screen.getByText(/Nossa história/i)).toBeInTheDocument();
  });

  it("renders mission, vision and values cards", () => {
    render(<About />);
    expect(screen.getByText("Missão")).toBeInTheDocument();
    expect(screen.getByText("Visão")).toBeInTheDocument();
    expect(screen.getByText("Valores")).toBeInTheDocument();
  });

  it("renders the 'Por que escolher' sub-section", () => {
    render(<About />);
    expect(
      screen.getByText(/Por que escolher o CPX Labs\?/i)
    ).toBeInTheDocument();
  });

  it("renders all four differentiators", () => {
    render(<About />);
    expect(screen.getByText(/Time sênior e especializado/i)).toBeInTheDocument();
    expect(screen.getByText(/Metodologia ágil e transparente/i)).toBeInTheDocument();
    expect(screen.getByText(/Soluções sob medida/i)).toBeInTheDocument();
    expect(screen.getByText(/Suporte e parceria de longo prazo/i)).toBeInTheDocument();
  });

  it("renders company stats grid", () => {
    render(<About />);
    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText("Fundação")).toBeInTheDocument();
    expect(screen.getByText("Países atendidos")).toBeInTheDocument();
  });

  it("renders team heading and all four members", () => {
    render(<About />);
    expect(screen.getByText(/Nossa Liderança/i)).toBeInTheDocument();
    expect(screen.getByText("Carlos Pereira")).toBeInTheDocument();
    expect(screen.getByText("Ana Lima")).toBeInTheDocument();
    expect(screen.getByText("Rafael Souza")).toBeInTheDocument();
    expect(screen.getByText("Beatriz Santos")).toBeInTheDocument();
  });

  it("renders team member roles", () => {
    render(<About />);
    expect(screen.getByText(/CEO & Co-fundador/i)).toBeInTheDocument();
    expect(screen.getByText(/CTO & Co-fundadora/i)).toBeInTheDocument();
    expect(screen.getByText(/Head de Engenharia/i)).toBeInTheDocument();
    expect(screen.getByText(/Head de Projetos/i)).toBeInTheDocument();
  });
});
