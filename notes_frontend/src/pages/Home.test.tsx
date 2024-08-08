// @ts-expect-error

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as reactQuery from "@tanstack/react-query";

// Mock the notes API functions
vi.mock("@/api/notes", () => ({
  getNotesFn: vi.fn(),
  createNoteFn: vi.fn(),
  updateNoteFn: vi.fn(),
  deleteNoteFn: vi.fn(),
}));

// Partially mock the @tanstack/react-query module to keep the original exports
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(),
  };
});

// Mock react-responsive-masonry
vi.mock("react-responsive-masonry", () => ({
  ResponsiveMasonry: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const queryClient = new QueryClient();

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("Home Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays loading state", () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isPending: true,
      error: null,
      data: null,
    } as any);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error state", async () => {
    const error = new Error("Failed to fetch notes");
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isPending: false,
      error,
      data: null,
    } as any);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(
        screen.getByText(`An error has occurred: ${error.message}`)
      ).toBeInTheDocument();
    });
  });

  it("displays notes", async () => {
    const notes = [
      {
        id: 1,
        title: "Note 1",
        content: "Content 1",
        created_at: "2024-01-01T00:00:00Z",
        author: { username: "ppvan" },
      },
      {
        id: 2,
        title: "Note 2",
        content: "Content 2",
        created_at: "2024-01-02T00:00:00Z",
        author: { username: "ppvan" },
      },
    ];
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      isPending: false,
      error: null,
      data: notes,
    } as any);
    vi.mocked(reactQuery.useMutation).mockReturnValue({
      isPending: false,
      error: null,
      mutate: vi.fn,
    } as any);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      notes.forEach((note) => {
        expect(screen.getByText(note.title)).toBeInTheDocument();
        expect(screen.getByText(note.content)).toBeInTheDocument();
      });
    });
  });
});
