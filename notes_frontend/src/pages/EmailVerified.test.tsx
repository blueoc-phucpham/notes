// EmailVerified.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EmailVerified from "./EmailVerified";
import * as reactQuery from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the useParams hook
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ token: "test-token" }),
  };
});

// Partially mock the @tanstack/react-query module to keep the original exports
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const queryClient = new QueryClient();

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("EmailVerified Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays loading state", () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
    } as any);

    render(
      <BrowserRouter>
        <EmailVerified />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Verifying your email...")).toBeInTheDocument();
  });

  it("displays error state", async () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
    } as any);

    render(
      <BrowserRouter>
        <EmailVerified />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("Error verifying email. Please try again.")).toBeInTheDocument();
    });
  });

  it("displays success state", async () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
    } as any);

    render(
      <BrowserRouter>
        <EmailVerified />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("Email Verified")).toBeInTheDocument();
      expect(screen.getByText("Your email address was successfully verified.")).toBeInTheDocument();
      expect(screen.getByText("Go to Login Page")).toBeInTheDocument();
    });
  });
});
