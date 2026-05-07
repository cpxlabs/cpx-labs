import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the brand logo text", () => {
    render(<Footer />);
    // There are two 'Labs' elements (header + footer), getAll to confirm footer is present
    const labsElements = screen.getAllByText("Labs");
    expect(labsElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the brand tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText(/parceiro estratégico em tecnologia/i)
    ).toBeInTheDocument();
  });

  it("renders all navigation link groups", () => {
    render(<Footer />);
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    // "Serviços" appears as both a heading and a link — use getAllBy
    expect(screen.getAllByText("Serviços").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders internal navigation links", () => {
    render(<Footer />);
    const quemSomosLinks = screen.getAllByRole("link", { name: /Quem Somos/i });
    expect(quemSomosLinks.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("link", { name: /Política de Privacidade/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /LGPD/i })
    ).toBeInTheDocument();
  });

  it("renders social network links", () => {
    render(<Footer />);
    const linkedinLinks = screen.getAllByRole("link", { name: /LinkedIn/i });
    const githubLinks = screen.getAllByRole("link", { name: /GitHub/i });
    expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
    expect(githubLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the copyright notice with the current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(
      screen.getByText(/Todos os direitos reservados/i)
    ).toBeInTheDocument();
  });

  it("renders LGPD link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /LGPD/i })).toBeInTheDocument();
  });
});
