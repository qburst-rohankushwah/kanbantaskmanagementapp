import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Board from "../Board";
import { useSearch } from "../../../contexts/SearchContext";

// Mock child components and hooks to isolate Board component testing
vi.mock("../Column", () => ({
  default: vi.fn(({ title, items }) => (
    <div data-testid={`column-${title}`}>
      {title}: {items.length} items
    </div>
  )),
}));

// vi.mock("../../hooks/useLocalStorage", () => ({
//   default: vi.fn(),
// }));

const mockUseLocalStorage = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useLocalStorage", () => ({
  default: mockUseLocalStorage,
}));

vi.mock("../../../contexts/SearchContext", () => ({
  useSearch: vi.fn(),
}));

const mockUseDragAndDrop = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useDragAndDrop", () => ({
  default: mockUseDragAndDrop,
}));

vi.mock("@dnd-kit/core", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    DragOverlay: ({ children }) => <div>{children}</div>,
  };
});

vi.mock("../../UI/DragOverLay", () => ({
  default: () => <div data-testid="drag-overlay">Overlay</div>,
}));

describe("Board Component", () => {
  const mockTasks = {
    todo: [{ id: "1", title: "Task 1", column: "todo" }],
    inProgress: [{ id: "2", title: "Task 2", column: "inProgress" }],
    done: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useLocalStorage to return controlled task arrays
    mockUseLocalStorage.mockImplementation((key) => {
      return {
        value: mockTasks[key] || [],
        saveValue: vi.fn(),
      };
    });

    // Mock useSearch
    useSearch.mockReturnValue({ searchQuery: "" });

    // Mock useDragAndDrop return values that the Board consumes
    mockUseDragAndDrop.mockReturnValue({
      sensors: [],
      handleDragStart: vi.fn(),
      handleDragEnd: vi.fn(),
      activeId: null,
      findTaskById: vi.fn(),
      todoTasks: mockTasks.todo,
      inProgressTasks: mockTasks.inProgress,
      doneTasks: mockTasks.done,
    });
  });

  it("renders three columns with correct titles", () => {
    render(<Board />);
    expect(screen.getByTestId("column-TODO")).toBeInTheDocument();
    expect(screen.getByTestId("column-IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByTestId("column-Done")).toBeInTheDocument();
  });

  it("initializes useDragAndDrop with data from localStorage and search context", () => {
    render(<Board />);
    expect(mockUseDragAndDrop).toHaveBeenCalledWith(expect.objectContaining({
      todoTasksValue: mockTasks.todo,
      searchQuery: "",
    }));
  });

  it("renders DragOverlay when a task is currently active (activeId is set)", () => {
    mockUseDragAndDrop.mockReturnValue({
      sensors: [],
      handleDragStart: vi.fn(),
      handleDragEnd: vi.fn(),
      activeId: "task-123",
      findTaskById: vi.fn(),
      todoTasks: [], inProgressTasks: [], doneTasks: [],
    });

    render(<Board />);
    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
  });
});