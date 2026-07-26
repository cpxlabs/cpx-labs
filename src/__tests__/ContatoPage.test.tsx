import { render, screen } from "@testing-library/react";
import ContatoPage from "@/app/contato/page";

describe("ContatoPage", () => {
  it("renders the page heading", () => {
    render(<ContatoPage />);
    expect(screen.getByText(/Entre em Contato/i)).toBeInTheDocument();
  });

  it("renders the contact form", () => {
    render(<ContatoPage />);
    expect(screen.getByPlaceholderText(/Seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email\.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
    ).toBeInTheDocument();
  });

  it("renders contact info cards", () => {
    render(<ContatoPage />);
    expect(screen.getByText(/contato\.cpxlabs@gmail\.com/)).toBeInTheDocument();
    expect(screen.getByText(/\(21\) 97554-2783/)).toBeInTheDocument();
    expect(screen.getByText(/Rio de Janeiro, RJ/i)).toBeInTheDocument();
  });
});
