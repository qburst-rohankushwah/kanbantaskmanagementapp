import { renderHook, act } from "@testing-library/react";
import { TaskModalProvider, useTaskModal } from "../TaskModalContext";
import { describe, it, expect, vi } from "vitest";

describe("TaskModalContext", () => {
  it("provides default values when wrapped in TaskModalProvider", () => {
    const { result } = renderHook(() => useTaskModal(), {
      wrapper: TaskModalProvider,
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.task).toBeNull();
  });

  it("updates state correctly when openModal is called without a task", () => {
    const { result } = renderHook(() => useTaskModal(), {
      wrapper: TaskModalProvider,
    });

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.task).toBeNull();
  });

  it("updates state correctly when openModal is called with a task to edit", () => {
    const { result } = renderHook(() => useTaskModal(), {
      wrapper: TaskModalProvider,
    });

    const mockTask = {
      id: "task-1",
      title: "Fix Bug",
      description: "Critical bug",
      assignee: "John",
      dueDate: "2023-12-01",
      column: "todo",
      priority: "high",
    };

    act(() => {
      result.current.openModal(mockTask);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.task).toEqual(mockTask);
  });

  it("resets state correctly when closeModal is called", () => {
    const { result } = renderHook(() => useTaskModal(), {
      wrapper: TaskModalProvider,
    });

    // Open first
    act(() => {
      result.current.openModal({ title: "Test" });
    });
    expect(result.current.isOpen).toBe(true);

    // Then close
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.task).toBeNull();
  });

  it("throws an error when useTaskModal is used outside of TaskModalProvider", () => {
    // Silence console error for the expected throw to keep test output clean
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => renderHook(() => useTaskModal())).toThrow(
      "useTaskModal must be used within a TaskModalProvider"
    );
    
    consoleSpy.mockRestore();
  });
});