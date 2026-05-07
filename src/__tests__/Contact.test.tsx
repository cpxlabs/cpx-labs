import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/components/Contact";

// Mock fetch for form submission tests
const mockFetch = jest.fn();
beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

describe("Contact — rendering", () => {
  it("renders the section heading", () => {
    render(<Contact />);
    expect(
      screen.getByText(/Vamos conversar sobre o seu projeto/i)
    ).toBeInTheDocument();
  });

  it("renders the section label badge", () => {
    render(<Contact />);
    expect(screen.getByText(/Entre em contato/i)).toBeInTheDocument();
  });

  it("renders contact info cards", () => {
    render(<Contact />);
    // "E-mail" appears as a contact-card label and as a form label — use getAllBy
    expect(screen.getAllByText(/^E-mail$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/contato@cpxlabs\.com\.br/i)).toBeInTheDocument();
    expect(screen.getByText(/Telefone \/ WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/São Paulo, SP/i)).toBeInTheDocument();
  });

  it("renders the contact form with all required fields", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/Seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email\.com/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Descreva brevemente/i)
    ).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<Contact />);
    expect(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    ).toBeInTheDocument();
  });

  it("renders social network links", () => {
    render(<Contact />);
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Instagram/i })).toBeInTheDocument();
  });
});

describe("Contact — form interaction", () => {
  it("updates form fields when typed into", async () => {
    render(<Contact />);
    const nameInput = screen.getByPlaceholderText(/Seu nome/i);
    await userEvent.type(nameInput, "João Silva");
    expect(nameInput).toHaveValue("João Silva");
  });

  it("shows success state after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Contact />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "João");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "joao@email.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva brevemente/i),
      "Preciso de ajuda com TI"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Mensagem enviada!/i)).toBeInTheDocument();
    });
  });

  it("shows error message when submission fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erro interno do servidor." }),
    });

    render(<Contact />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Maria");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "maria@email.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva brevemente/i),
      "Quero saber mais sobre os serviços"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Erro interno do servidor\./i)
      ).toBeInTheDocument();
    });
  });

  it("posts to /api/contact with correct payload", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Contact />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Pedro");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "pedro@empresa.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Nome da sua empresa/i),
      "Empresa LTDA"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva brevemente/i),
      "Mensagem de teste"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body as string);
    expect(body.name).toBe("Pedro");
    expect(body.email).toBe("pedro@empresa.com");
    expect(body.company).toBe("Empresa LTDA");
    expect(body.message).toBe("Mensagem de teste");
  });

  it("allows sending another message after success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Contact />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Ana");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "ana@test.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva brevemente/i),
      "Olá"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    );

    await waitFor(() =>
      expect(screen.getByText(/Mensagem enviada!/i)).toBeInTheDocument()
    );

    await userEvent.click(
      screen.getByText(/Enviar outra mensagem/i)
    );

    expect(
      screen.getByRole("button", { name: /Enviar Mensagem/i })
    ).toBeInTheDocument();
  });
});
