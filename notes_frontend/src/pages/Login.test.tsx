/* eslint-disable @typescript-eslint/no-explicit-any */
// Login.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Login from "./Login";
import * as userHooks from "@/hooks/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the entire user hooks module
vi.mock("@/hooks/user", () => ({
  useLoginMutation: vi.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: { pathname: "/dashboard" } } }),
  };
});

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders login form", () => {
    const mockMutate = vi.fn();
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("displays validation errors for empty form submission", async () => {
    const mockMutate = vi.fn();
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(screen.getByText("username too short")).toBeInTheDocument();
      expect(screen.getByText("password can't be blank")).toBeInTheDocument();
    });
  });

  it("calls loginMutation.mutate with form data on valid submission", async () => {
    const mockMutate = vi.fn();
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { username: "testuser", password: "password123" },
        expect.any(Object)
      );
    });
  });

  it("stores tokens and navigates on successful login", async () => {
    const mockMutate = vi.fn().mockImplementation((_, options) => {
      options.onSuccess({ access: "access_token", refresh: "refresh_token" });
    });
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>,
      { wrapper: createWrapper() }
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(localStorage.getItem("access_token")).toBe("access_token");
      expect(localStorage.getItem("refresh_token")).toBe("refresh_token");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", {
        replace: true,
      });
    });
  });

  it("displays error message on login failure", async () => {
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isError: true,
      error: { message: "Invalid credentials" } as any,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("disables login button and shows loading state during login", async () => {
    vi.mocked(userHooks.useLoginMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    expect(
      screen.getByRole("button", { name: "Login In..." })
    ).toBeInTheDocument();
  });
});
