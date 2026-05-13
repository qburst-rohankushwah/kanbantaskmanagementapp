import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TaskModal from "../TaskModal";
import { useTaskModal } from "../../../contexts/TaskModalContext";
import { readStorage, writeStorage } from "../../../hooks/useLocalStorage";
import { logActivity } from "../../../utils/utils";

// Mock external dependencies
vi.mock("../../../contexts/TaskModalContext", () => ({
  useTaskModal: vi.fn(),
}));

vi.mock("../../../hooks/useLocalStorage", () => ({
  readStorage: vi.fn(),
  writeStorage: vi.fn(),
}));

vi.mock("../../../utils/utils", () => ({
  logActivity: vi.fn(),
}));

vi.mock("../../../utils/constant", () => ({
  Status: [
    { name: "Low", value: "low", type: "low" },
    { name: "Medium", value: "medium", type: "medium" },
    { name: "High", value: "high", type: "high" },
  ],
}));

// Mock PriorityChip component
vi.mock("../../UI/PriorityChip", () => ({
  __esModule: true,
  default: ({ onChange, data, showSelected }) => (
    <div data-testid="priority-chip-mock">
      {data.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange({ key: "priority", value: item.value })}
          className={
            showSelected && item.value === "medium" ? "selected-chip" : ""
          } // Simulate default selection
        >
          {item.name}
        </button>
      ))}
    </div>
  ),
}));

describe("TaskModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOpenModal = vi.fn(); // Not directly used by TaskModal, but part of useTaskModal

  const existingTask = {
    title: "Existing Task",
    description: "Existing Description",
    assignee: "John Doe",
    dueDate: "2023-12-31",
    column: "inProgress",
    priority: "high",
    id: "task-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTaskModal.mockReturnValue({ openModal: mockOpenModal, task: null }); // Default to no task (add mode)
    readStorage.mockReturnValue([]); // Default empty storage
    vi.spyOn(Date, "now").mockReturnValue(1678886400000); // Consistent timestamp
    document.body.style.overflow = "unset";
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <TaskModal isOpen={false} onClose={mockOnClose} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly for adding a new task (default state)", () => {
    useTaskModal.mockReturnValue({ openModal: mockOpenModal, task: null });
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Add New Task")).toBeTruthy();
    expect(screen.getByLabelText("Task Title *")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Assignee")).toHaveValue("");
    expect(screen.getByLabelText("Due Date")).toHaveValue("");
    expect(screen.getByLabelText("Column")).toHaveValue("todo");
    expect(screen.getByTestId("priority-chip-mock")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add Task" })).toBeTruthy();
  });

  it("renders correctly for editing an existing task", () => {
    useTaskModal.mockReturnValue({
      openModal: mockOpenModal,
      task: existingTask,
    });
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Update Task")).toBeTruthy();
    expect(screen.getByLabelText("Task Title *")).toHaveValue(
      existingTask.title,
    );
    expect(screen.getByLabelText("Description")).toHaveValue(
      existingTask.description,
    );
    expect(screen.getByLabelText("Assignee")).toHaveValue(
      existingTask.assignee,
    );
    expect(screen.getByLabelText("Due Date")).toHaveValue(existingTask.dueDate);
    expect(screen.getByLabelText("Column")).toHaveValue(existingTask.column);
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeTruthy();
  });

  it("updates form data on input change", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText("Task Title *"), {
      target: { value: "New Title" },
    });
    expect(screen.getByLabelText("Task Title *")).toHaveValue("New Title");

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New Description" },
    });
    expect(screen.getByLabelText("Description")).toHaveValue("New Description");

    fireEvent.change(screen.getByLabelText("Assignee"), {
      target: { value: "Alice" },
    });
    expect(screen.getByLabelText("Assignee")).toHaveValue("Alice");

    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-01-01" },
    });
    expect(screen.getByLabelText("Due Date")).toHaveValue("2024-01-01");

    fireEvent.change(screen.getByLabelText("Column"), {
      target: { value: "done" },
    });
    expect(screen.getByLabelText("Column")).toHaveValue("done");
  });

 
  it("calls onClose when the close button is clicked", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking on the backdrop", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("modal-backdrop")); // Assuming modalBackdrop has data-testid="modal-backdrop"
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal content", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("heading", { name: "Add New Task" }));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("adds a new task on submission", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText("Task Title *"), {
      target: { value: "New Task Title" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Task Description" },
    });
    fireEvent.change(screen.getByLabelText("Assignee"), {
      target: { value: "Dev" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-03-15" },
    });
    fireEvent.change(screen.getByLabelText("Column"), {
      target: { value: "inProgress" },
    });
    fireEvent.click(screen.getByRole("button", { name: "High" })); // Set priority to high

    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

    expect(readStorage).toHaveBeenCalledWith("inProgress", []);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // Form should be reset after submission
    expect(screen.getByLabelText("Task Title *")).toHaveValue("");
  });

  it("does not submit if title is empty", () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

    expect(writeStorage).not.toHaveBeenCalled();
    expect(logActivity).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("updates an existing task in the same column", () => {
    useTaskModal.mockReturnValue({
      openModal: mockOpenModal,
      task: existingTask,
    });
    readStorage.mockReturnValue([
      existingTask,
      { id: "task-456", column: "inProgress" },
    ]);
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    const expectedUpdatedTask = {
      ...existingTask,
      description: "Updated Description",
      updatedAt: 1678886400000,
    };

    expect(readStorage).toHaveBeenCalledWith("inProgress", []);
    expect(writeStorage).toHaveBeenCalledWith("inProgress", [
      expectedUpdatedTask,
      { id: "task-456", column: "inProgress" },
    ]);
    expect(logActivity).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "MOVE" }),
    );
    expect(logActivity).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "CREATE" }),
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("moves an existing task to a different column", () => {
    useTaskModal.mockReturnValue({
      openModal: mockOpenModal,
      task: existingTask,
    });
    readStorage.mockImplementation((key) => {
      if (key === "inProgress") return [existingTask];
      if (key === "done") return [{ id: "task-789", column: "done" }];
      return [];
    });
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText("Column"), {
      target: { value: "done" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    const expectedMovedTask = {
      ...existingTask,
      column: "done",
      updatedAt: 1678886400000,
    };

    expect(readStorage).toHaveBeenCalledWith("inProgress", []);
    expect(readStorage).toHaveBeenCalledWith("done", []);
    expect(writeStorage).toHaveBeenCalledWith("inProgress", []);
    expect(writeStorage).toHaveBeenCalledWith("done", [
      { id: "task-789", column: "done" },
      expectedMovedTask,
    ]);
    expect(logActivity).toHaveBeenCalledWith({
      type: "MOVE",
      task: expectedMovedTask,
      from: "inProgress",
      to: "done",
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("sets document.body.style.overflow to hidden when modal opens and unset when it closes", () => {
    const { rerender, unmount } = render(<TaskModal isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe("unset");

    // Open the modal
    rerender(<TaskModal isOpen={true} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe("hidden");

    // Simulate parent closing the modal
    rerender(<TaskModal isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe("unset");

    // Verify cleanup on unmount
    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});
