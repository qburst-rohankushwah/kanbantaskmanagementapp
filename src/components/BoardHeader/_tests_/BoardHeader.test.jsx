import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BoardHeader from "../index";
import { useSearch } from "../../../contexts/SearchContext";

// Mock the SearchContext hook
vi.mock("../../../contexts/SearchContext", () => ({
  useSearch: vi.fn(),
}));

// Mock sub-components to isolate BoardHeader logic
vi.mock("../../UI/SearchBar", () => ({
  default: vi.fn(({ searchTerm }) => (
    <div data-testid="mock-search-bar">{searchTerm}</div>
  )),
}));

vi.mock("../../UI/PriorityChip", () => ({
  default: vi.fn(({ data }) => (
    <div data-testid="mock-priority-chip">{data?.length} items</div>
  )),
}));

describe("BoardHeader Component", () => {
  const mockSetSearchQuery = vi.fn();
  const mockSetIsFilterOpen = vi.fn();
  const mockSetIsHistoryOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useSearch
    useSearch.mockReturnValue({
      searchQuery: "initial query",
      setSearchQuery: mockSetSearchQuery,
      setIsFilterOpen: mockSetIsFilterOpen,
      setIsHistoryOpen: mockSetIsHistoryOpen,
    });
  });

  it("renders the sprint title correctly", () => {
    render(<BoardHeader />);
    expect(screen.getByText("Sprint 4 - TeamFlow Board")).toBeInTheDocument();
  });

  it("renders PriorityChip and SearchBar with correct props from context", () => {
    render(<BoardHeader />);
    
    const searchBar = screen.getByTestId("mock-search-bar");
    const priorityChip = screen.getByTestId("mock-priority-chip");

    expect(searchBar).toHaveTextContent("initial query");
    // BoardMenuItems has 3 items defined in constants
    expect(priorityChip).toHaveTextContent("3 items");
  });

  it("calls setIsFilterOpen(true) when the Filter Task button is clicked", () => {
    render(<BoardHeader />);
    
    const filterButton = screen.getByRole("button", { name: /filter task/i });
    fireEvent.click(filterButton);

    expect(mockSetIsFilterOpen).toHaveBeenCalledWith(true);
  });

  it("calls setIsHistoryOpen(true) when the View History button is clicked", () => {
    render(<BoardHeader />);
    
    const historyButton = screen.getByRole("button", { name: /view history/i });
    fireEvent.click(historyButton);

    expect(mockSetIsHistoryOpen).toHaveBeenCalledWith(true);
  });
});