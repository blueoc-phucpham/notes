import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { vi } from "vitest";

// Mock authentication components
vi.mock("./components/mine/RequireAuth", () => ({
  RequireAuth: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  NonAuthenticateUserOnly: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RequireAdmin: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("react-responsive-masonry", () => ({
  ResponsiveMasonry: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("App", () => {
  const queryClient = new QueryClient();

  const renderApp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );

  test("renders home page", () => {
    renderApp();
    expect(screen.getByText(/note/i)).toBeInTheDocument();
  });

  test("renders login page", () => {
    renderApp();
    screen.getByText(/login/i).click();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test("renders sign up page", () => {
    renderApp();
    screen.getByText(/sign up/i).click();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

});
