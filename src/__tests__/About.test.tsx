import { render, screen } from "@testing-library/react";
import About from "@/components/About";

describe("About", () => {
  it("renders the section label badge", () => {
    render(<About />);
    expect(screen.getByText(/História e Valores/i)).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<About />);
    expect(screen.getByText("Quem Somos")).toBeInTheDocument();
  });

  it("renders the mission description", () => {
    render(<About />);
    expect(
      screen.getByText(/impulsionar negócios através de soluções tecnológicas avançadas/i)
    ).toBeInTheDocument();
  });

  it("renders all three values", () => {
    render(<About />);
    expect(screen.getByText("Inovação")).toBeInTheDocument();
    expect(screen.getByText("Integridade")).toBeInTheDocument();
    expect(screen.getByText("Qualidade")).toBeInTheDocument();
  });

  it("renders the code mockup panel", () => {
    render(<About />);
    expect(screen.getByText(/cpx-labs-dashboard\.json/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture Verified/i)).toBeInTheDocument();
  });
});
