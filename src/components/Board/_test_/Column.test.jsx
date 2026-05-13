import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Column from "../Column";
import { useTaskModal } from "../../../contexts/TaskModalContext";
import { useDroppable } from "@dnd-kit/core";

// Mock child components to isolate the Column component
vi.mock("../../Task/TaskCard", () => ({
  default: vi.fn(({ data }) => <div data-testid="task-card">{data.title}</div>),
}));

vi.mock("../../UI/Badge", () => ({
  default: vi.fn(({ count }) => <div data-testid="badge">{count}</div>),
}));

vi.mock("../../UI/AddTaskButton", () => ({
  default: vi.fn(({ onClick }) => (
    <button data-testid="add-task-button" onClick={onClick}>
      Add Task
    </button>
  )),
}));

// Mock dnd-kit hooks and components
vi.mock("@dnd-kit/core", () => ({
  useDroppable: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: vi.fn(({ children }) => <div data-testid="sortable-context">{children}</div>),
  verticalListSortingStrategy: vi.fn(),
}));

// Mock the TaskModal context hook
vi.mock("../../../contexts/TaskModalContext", () => ({
  useTaskModal: vi.fn(),
}));

describe("Column Component", () => {
  const mockOpenModal = vi.fn();
  const mockSetNodeRef = vi.fn();
  const defaultProps = {
    title: "TODO",
    count: 2,
    items: [
      { id: "task-1", title: "Task 1" },
      { id: "task-2", title: "Task 2" },
    ],
    type: "todo",
    id: "todo-column",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTaskModal.mockReturnValue({ openModal: mockOpenModal });
    useDroppable.mockReturnValue({
      setNodeRef: mockSetNodeRef,
      isOver: false,
    });
  });

  it("renders the column title and task count Badge", () => {
    render(<Column {...defaultProps} />);
    
    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toHaveTextContent("2");
  });

  it("renders the correct number of TaskCard components based on items prop", () => {
    render(<Column {...defaultProps} />);
    
    const taskCards = screen.getAllByTestId("task-card");
    expect(taskCards).toHaveLength(2);
    expect(taskCards[0]).toHaveTextContent("Task 1");
    expect(taskCards[1]).toHaveTextContent("Task 2");
  });

  it("calls openModal from context when the AddTaskButton is clicked", () => {
    render(<Column {...defaultProps} />);
    
    const addButton = screen.getByTestId("add-task-button");
    fireEvent.click(addButton);
    
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it("initializes useDroppable with the provided column id", () => {
    render(<Column {...defaultProps} />);
    
    expect(useDroppable).toHaveBeenCalledWith({ id: "todo-column" });
  });

  it("applies the dragging-over class when isOver is true from useDroppable", () => {
    useDroppable.mockReturnValue({
      setNodeRef: mockSetNodeRef,
      isOver: true,
    });
    
    const { container } = render(<Column {...defaultProps} />);
    const columnContainer = container.querySelector(".cardContainer");
    
    expect(columnContainer).toHaveClass("dragging-over");
  });

  it("handles null or empty items gracefully by falling back to an empty list", () => {
    const { rerender } = render(<Column {...defaultProps} items={[]} count={0} />);
    expect(screen.queryByTestId("task-card")).not.toBeInTheDocument();
    expect(screen.getByTestId("badge")).toHaveTextContent("0");

    rerender(<Column {...defaultProps} items={null} count={0} />);
    expect(screen.queryByTestId("task-card")).not.toBeInTheDocument();
  });
});
