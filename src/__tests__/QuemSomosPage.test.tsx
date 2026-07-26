import { render, screen } from "@testing-library/react";
import QuemSomosPage from "@/app/quem-somos/page";

describe("QuemSomosPage", () => {
  it("renders the page heading", () => {
    render(<QuemSomosPage />);
    expect(screen.getByText(/Quem Somos/i)).toBeInTheDocument();
  });

  it("renders the mission section", () => {
    render(<QuemSomosPage />);
    expect(screen.getByText(/Nossa Missão/i)).toBeInTheDocument();
  });

  it("renders the vision section", () => {
    render(<QuemSomosPage />);
    expect(screen.getByText(/Nossa Visão/i)).toBeInTheDocument();
  });

  it("renders all three values", () => {
    render(<QuemSomosPage />);
    expect(screen.getByText("Inovação")).toBeInTheDocument();
    expect(screen.getByText("Integridade")).toBeInTheDocument();
    expect(screen.getByText("Qualidade")).toBeInTheDocument();
  });
});
