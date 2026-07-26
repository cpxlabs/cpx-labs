import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

const mockFetch = jest.fn();
beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

describe("ContactForm", () => {
  it("renders all required form fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText(/Seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Descreva seu projeto/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Como podemos ajudar/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
    ).toBeInTheDocument();
  });

  it("updates form fields when typed into", async () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/Seu nome/i);
    await userEvent.type(nameInput, "João Silva");
    expect(nameInput).toHaveValue("João Silva");
  });

  it("shows success state after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "João");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "joao@email.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva seu projeto/i),
      "Preciso de ajuda com TI"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
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

    render(<ContactForm />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Maria");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "maria@email.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva seu projeto/i),
      "Quero saber mais sobre os serviços"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
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

    render(<ContactForm />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Pedro");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "pedro@empresa.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Como podemos ajudar/i),
      "Consultoria em Cloud"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva seu projeto/i),
      "Mensagem de teste"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body as string);
    expect(body.name).toBe("Pedro");
    expect(body.email).toBe("pedro@empresa.com");
    expect(body.subject).toBe("Consultoria em Cloud");
    expect(body.message).toBe("Mensagem de teste");
  });

  it("allows sending another message after success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);
    await userEvent.type(screen.getByPlaceholderText(/Seu nome/i), "Ana");
    await userEvent.type(
      screen.getByPlaceholderText(/seu@email\.com/i),
      "ana@test.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Descreva seu projeto/i),
      "Olá"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
    );

    await waitFor(() =>
      expect(screen.getByText(/Mensagem enviada!/i)).toBeInTheDocument()
    );

    await userEvent.click(
      screen.getByText(/Enviar outra mensagem/i)
    );

    expect(
      screen.getByRole("button", { name: /Falar com um Especialista/i })
    ).toBeInTheDocument();
  });
});
