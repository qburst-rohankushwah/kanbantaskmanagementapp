import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useDragAndDrop from "../useDragAndDrop";
import { arrayMove } from "@dnd-kit/sortable";

// Mock external dependencies that perform side effects
const mockLogActivity = vi.hoisted(() => vi.fn());
vi.mock("../../utils/utils", () => ({
  logActivity: mockLogActivity,
}));

vi.mock("@dnd-kit/sortable", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    arrayMove: vi.fn((array, from, to) => {
      const newArray = [...array];
      newArray.splice(to, 0, newArray.splice(from, 1)[0]);
      return newArray;
    }),
  };
});

describe("useDragAndDrop Hook", () => {
  const initialTodo = [{ id: "1", title: "Task 1", column: "todo", description: "First task" }];
  const initialInProgress = [{ id: "2", title: "Task 2", column: "inProgress" }];

  const mockProps = {
    todoTasksValue: initialTodo,
    saveTodoTasks: vi.fn(),
    inProgressTasksValue: initialInProgress,
    saveInProgressTasks: vi.fn(),
    doneTasksValue: [],
    saveDoneTasks: vi.fn(),
    searchQuery: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters tasks correctly based on searchQuery in title and description", () => {
    const { result } = renderHook(() => useDragAndDrop({ ...mockProps, searchQuery: "First" }));
    expect(result.current.todoTasks).toHaveLength(1);
    expect(result.current.inProgressTasks).toHaveLength(0);
  });

  it("findTaskById correctly locates a task across all column arrays", () => {
    const { result } = renderHook(() => useDragAndDrop(mockProps));
    const task = result.current.findTaskById("2");
    expect(task).toEqual(initialInProgress[0]);
  });

  it("updates activeId on handleDragStart", () => {
    const { result } = renderHook(() => useDragAndDrop(mockProps));
    act(() => {
      result.current.handleDragStart({ active: { id: "1" } });
    });
    expect(result.current.activeId).toBe("1");
  });

  it("reorders tasks within the same column on handleDragEnd", () => {
    const multiTodo = [
      { id: "1", title: "T1", column: "todo" },
      { id: "2", title: "T2", column: "todo" },
    ];
    const { result } = renderHook(() => useDragAndDrop({ ...mockProps, todoTasksValue: multiTodo }));

    act(() => {
      result.current.handleDragEnd({
        active: { id: "1" },
        over: { id: "2" },
      });
    });

    expect(arrayMove).toHaveBeenCalledWith(multiTodo, 0, 1);
    expect(mockProps.saveTodoTasks).toHaveBeenCalled();
  });

  it("moves a task to a different column and logs activity on handleDragEnd", () => {
    const { result } = renderHook(() => useDragAndDrop(mockProps));

    act(() => {
      result.current.handleDragEnd({
        active: { id: "1" }, // from 'todo'
        over: { id: "inProgress" }, // to 'inProgress' column
      });
    });

    // Verifies the removal from the old list and addition to the new list
    expect(mockProps.saveTodoTasks).toHaveBeenCalledWith([]);
    expect(mockProps.saveInProgressTasks).toHaveBeenCalled();
    expect(mockLogActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "MOVE",
        from: "todo",
        to: "inProgress",
      })
    );
  });

  it("does not trigger updates if task is dropped in its current column header", () => {
    const { result } = renderHook(() => useDragAndDrop(mockProps));

    act(() => {
      result.current.handleDragEnd({
        active: { id: "1" },
        over: { id: "todo" },
      });
    });

    expect(mockProps.saveTodoTasks).not.toHaveBeenCalled();
    expect(result.current.activeId).toBeNull();
  });
});