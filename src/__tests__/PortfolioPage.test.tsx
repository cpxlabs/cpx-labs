import { render, screen } from "@testing-library/react";
import PortfolioPage from "@/app/portfolio/page";

describe("PortfolioPage", () => {
  it("renders the page heading", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("Portfólio")).toBeInTheDocument();
  });

  it("renders the page description", () => {
    render(<PortfolioPage />);
    expect(
      screen.getByText(/Projetos open-source desenvolvidos por CPX Labs e az1nn/i)
    ).toBeInTheDocument();
  });

  it("renders all seven project cards", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("Smokebuzz")).toBeInTheDocument();
    expect(screen.getByText("OpenBand")).toBeInTheDocument();
    expect(screen.getByText("Cazimu")).toBeInTheDocument();
    expect(screen.getByText("Lilly's Box")).toBeInTheDocument();
    expect(screen.getByText("Fullstack Log Tower")).toBeInTheDocument();
    expect(screen.getByText("Hemp Ramps 3D")).toBeInTheDocument();
    expect(screen.getByText("MR. BANDS")).toBeInTheDocument();
  });

  it("renders GitHub and Live Demo links for each project", () => {
    render(<PortfolioPage />);
    const githubLinks = screen.getAllByRole("link", { name: /GitHub/i });
    const demoSlinks = screen.getAllByRole("link", { name: /Live Demo/i });
    expect(githubLinks).toHaveLength(7);
    expect(demoSlinks).toHaveLength(7);
  });
});
