import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterSideBar from "../FilterSideBar";
import { useSearch, SearchProvider } from "../../../contexts/SearchContext";
import { readStorage } from "../../../hooks/useLocalStorage";
import { fetchAssignee, isOverDue, isDueToday } from "../../../utils/utils";

// Mock dependencies
vi.mock("../../../contexts/SearchContext", () => ({
  useSearch: vi.fn(),
  SearchProvider: ({ children }) => children,
}));

vi.mock("../../../hooks/useLocalStorage", () => ({
  readStorage: vi.fn(),
}));

vi.mock("../../../utils/utils", () => ({
  fetchAssignee: vi.fn(),
  isOverDue: vi.fn(),
  isDueToday: vi.fn(),
}));

describe("FilterSideBar Component", () => {
  const mockSetIsFilterOpen = vi.fn();
  const mockSetFilters = vi.fn();
  
  const mockTasks = [
    { id: "1", title: "Task 1", priority: "high", assignee: "John", column: "todo", dueDate: "2023-10-10" },
    { id: "2", title: "Task 2", priority: "low", assignee: "Jane", column: "inProgress", dueDate: "2023-10-11" },
  ];

  const defaultFilters = {
    priority: [],
    assignee: [],
    isOverdue: false,
    isDueToday: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock returns
    useSearch.mockReturnValue({
      isFilterOpen: true,
      setIsFilterOpen: mockSetIsFilterOpen,
      filters: defaultFilters,
      setFilters: mockSetFilters,
    });

    readStorage.mockImplementation((key) => {
      if (key === "todo") return [mockTasks[0]];
      if (key === "inProgress") return [mockTasks[1]];
      return [];
    });

    fetchAssignee.mockReturnValue(["John", "Jane"]);
    isOverDue.mockReturnValue(false);
    isDueToday.mockReturnValue(false);
  });

  it("does not render when isFilterOpen is false", () => {
    useSearch.mockReturnValue({ 
      isFilterOpen: false,
      setIsFilterOpen: mockSetIsFilterOpen,
      filters: defaultFilters,
      setFilters: mockSetFilters,
    });
    const { container } = render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with task data and filter options", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    
    expect(screen.getByRole("heading", { name: /^filters$/i, level: 3 })).toBeTruthy();
    expect(screen.getByText(/Filtered Result \(2 tasks\)/i)).toBeTruthy();
    
    // Check if priorities are rendered
    expect(screen.getByText("low")).toBeTruthy();
    expect(screen.getByText("medium")).toBeTruthy();
    expect(screen.getByText("high")).toBeTruthy();

    // Scope the search to the filter section to avoid duplicates in the result list
    const filterSection = screen.getByText(/priority/i).closest(".filterOptionsSection");
    expect(within(filterSection).getByText("John")).toBeTruthy();
    expect(within(filterSection).getByText("Jane")).toBeTruthy();
  });

  it("calls setIsFilterOpen(false) when close button is clicked", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);
    expect(mockSetIsFilterOpen).toHaveBeenCalledWith(false);
  });

  it("updates priority filters when a priority checkbox is clicked", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    const lowCheckbox = screen.getAllByRole("checkbox")[0]; // "low" is first in priority list
    
    fireEvent.click(lowCheckbox);
    
    // It calls the functional update of setFilters
    expect(mockSetFilters).toHaveBeenCalled();
    const updateFn = mockSetFilters.mock.calls[0][0];
    const result = updateFn(defaultFilters);
    expect(result.priority).toContain("low");
  });

  it("updates assignee filters when an assignee checkbox is clicked", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    const johnCheckbox = screen.getByLabelText("John", { exact: false }).querySelector('input') 
      || screen.getAllByRole("checkbox")[3]; // Assignees come after 3 priorities

    fireEvent.click(johnCheckbox);
    
    expect(mockSetFilters).toHaveBeenCalled();
    const updateFn = mockSetFilters.mock.calls[0][0];
    const result = updateFn(defaultFilters);
    expect(result.assignee).toContain("John");
  });

  it("updates status filters (overdue/due today)", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    
    const overdueCheckbox = screen.getByText("Overdue").previousSibling.querySelector('input') 
      || screen.getAllByRole("checkbox")[5]; 

    fireEvent.click(overdueCheckbox);
    
    expect(mockSetFilters).toHaveBeenCalled();
    const updateFn = mockSetFilters.mock.calls[0][0];
    const result = updateFn(defaultFilters);
    expect(result.isOverdue).toBe(true);
  });

  it("clears all filters when 'Clear All Filters' is clicked", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    const clearButton = screen.getByText(/Clear All Filters/i);
    
    fireEvent.click(clearButton);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
  });

  it("displays task items in the results section", () => {
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    
    expect(screen.getByText("Task 1")).toBeTruthy();
    expect(screen.getByText("Task 2")).toBeTruthy();
    expect(screen.getByText("TODO")).toBeTruthy();
    expect(screen.getByText("INPROGRESS")).toBeTruthy();
  });

  it("shows empty state when no tasks match", () => {
    readStorage.mockReturnValue([]);
    render(
      <SearchProvider>
        <FilterSideBar />
      </SearchProvider>
    );
    expect(screen.getByText(/No tasks match selected filters/i)).toBeTruthy();
  });
});