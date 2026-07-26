import { render, screen } from "@testing-library/react";
import Contact from "@/components/Contact";

describe("Contact", () => {
  it("renders the section heading", () => {
    render(<Contact />);
    expect(
      screen.getByText(/Entre em Contato/i)
    ).toBeInTheDocument();
  });

  it("renders the section description", () => {
    render(<Contact />);
    expect(
      screen.getByText(/Pronto para impulsionar sua próxima transformação digital/i)
    ).toBeInTheDocument();
  });

  it("renders the phone contact", () => {
    render(<Contact />);
    expect(screen.getByText(/\(21\) 97554-2783/)).toBeInTheDocument();
    expect(screen.getByText(/Telefone \/ WhatsApp/i)).toBeInTheDocument();
  });

  it("renders the email contact", () => {
    render(<Contact />);
    expect(screen.getByText(/contato\.cpxlabs@gmail\.com/)).toBeInTheDocument();
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
  });

  it("has a tel link for phone", () => {
    render(<Contact />);
    const telLinks = screen.getAllByRole("link");
    const telLink = telLinks.find((l) => l.getAttribute("href") === "tel:+5521975542783");
    expect(telLink).toBeTruthy();
  });

  it("has a mailto link for email", () => {
    render(<Contact />);
    const mailLinks = screen.getAllByRole("link");
    const mailLink = mailLinks.find((l) => l.getAttribute("href") === "mailto:contato.cpxlabs@gmail.com");
    expect(mailLink).toBeTruthy();
  });
});
