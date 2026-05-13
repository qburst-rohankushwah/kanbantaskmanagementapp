import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HistorySideBar from "../HistorySideBar";
import { useSearch, SearchProvider } from "../../../contexts/SearchContext";
import { readStorage, writeStorage } from "../../../hooks/useLocalStorage";

// Mock hooks and local storage
vi.mock("../../../contexts/SearchContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSearch: vi.fn(),
  };
});

vi.mock("../../../hooks/useLocalStorage", () => ({
  readStorage: vi.fn(),
  writeStorage: vi.fn(),
}));

describe("HistorySideBar Component", () => {
  const mockSetIsHistoryOpen = vi.fn();
  const mockHistoryData = [
    {
      id: "hist-1",
      type: "CREATE",
      task: { id: "task-1", title: "New Task" },
      to: "todo",
      timestamp: "2023-10-27 10:00",
    },
    {
      id: "hist-2",
      type: "MOVE",
      task: { id: "task-2", title: "Moved Task" },
      from: "todo",
      to: "inProgress",
      timestamp: "2023-10-27 10:05",
    },
    {
      id: "hist-3",
      type: "DELETE",
      task: { id: "task-3", title: "Deleted Task" },
      from: "done",
      timestamp: "2023-10-27 10:10",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useSearch.mockReturnValue({
      isHistoryOpen: true,
      setIsHistoryOpen: mockSetIsHistoryOpen,
    });
    
    // Default mock returns for storage
    readStorage.mockImplementation((key, fallback) => {
      if (key === "history") return mockHistoryData;
      if (["todo", "inProgress", "done"].includes(key)) return [];
      return fallback;
    });
  });

  it("renders nothing when isHistoryOpen is false", () => {
    useSearch.mockReturnValue({ isHistoryOpen: false });
    const { container } = render(<HistorySideBar />);
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with activity items", () => {
    render(
      <SearchProvider>
        <HistorySideBar />
      </SearchProvider>
    );
    
    expect(screen.getByText(/ACTIVITY HISTORY/i)).toBeTruthy();
    expect(screen.getByText("New Task")).toBeTruthy();
    expect(screen.getByText("Moved Task")).toBeTruthy();
    expect(screen.getByText("todo → inProgress")).toBeTruthy();
    expect(screen.getByText("2023-10-27 10:10")).toBeTruthy();
  });

  it("shows empty state message when history is empty", () => {
    readStorage.mockReturnValue([]);
    render(<HistorySideBar />);
    expect(screen.getByText(/No recent activity found/i)).toBeTruthy();
  });

  it("closes the sidebar when the close button is clicked", () => {
    render(<HistorySideBar />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockSetIsHistoryOpen).toHaveBeenCalledWith(false);
  });

  it("clears all history when the clear button is clicked", () => {
    render(<HistorySideBar />);
    fireEvent.click(screen.getByText(/Clear All History/i));
    expect(writeStorage).toHaveBeenCalledWith("history", []);
  });

  it("disables Undo for CREATE actions if the task is no longer in the target column", () => {
    // Mock current board state: task-1 is now in 'done' instead of 'todo'
    readStorage.mockImplementation((key) => {
      if (key === "history") return [mockHistoryData[0]];
      if (key === "done") return [{ id: "task-1", column: "done" }];
      return [];
    });

    render(<HistorySideBar />);
    const undoButton = screen.getByRole("button", { name: /undo/i });
    expect(undoButton).toBeDisabled();
    expect(undoButton.className).toContain("cursor-not-allowed");
  });

  it("successfully performs undo for a DELETE action", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const deleteEntry = mockHistoryData[2]; // hist-3, DELETE from 'done'
    
    readStorage.mockImplementation((key) => {
      if (key === "history") return [deleteEntry];
      if (key === "done") return []; // Column is empty now
      return [];
    });

    render(<HistorySideBar />);
    fireEvent.click(screen.getByText("Undo"));

    // Should add task back to 'done'
    expect(writeStorage).toHaveBeenCalledWith("done", [deleteEntry.task]);
    // Should remove item from history
    expect(writeStorage).toHaveBeenCalledWith("history", []);
    // Should trigger storage event
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("successfully performs undo for a MOVE action", () => {
    const moveEntry = mockHistoryData[1]; // hist-2, MOVE from 'todo' to 'inProgress'
    
    readStorage.mockImplementation((key) => {
      if (key === "history") return [moveEntry];
      if (key === "inProgress") return [moveEntry.task]; // Currently in target
      if (key === "todo") return []; // Empty in source
      return [];
    });

    render(<HistorySideBar />);
    fireEvent.click(screen.getByText("Undo"));

    // Should remove from 'inProgress'
    expect(writeStorage).toHaveBeenCalledWith("inProgress", []);
    // Should add back to 'todo' with correct column property
    expect(writeStorage).toHaveBeenCalledWith("todo", [{ ...moveEntry.task, column: "todo" }]);
  });

  it("closes the sidebar when clicking on the overlay", () => {
    const { container } = render(<HistorySideBar />);
    const overlay = container.querySelector(".historyModalOverlay");
    fireEvent.click(overlay);
    expect(mockSetIsHistoryOpen).toHaveBeenCalledWith(false);
  });
});