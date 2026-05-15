import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isOverDue, isDueToday, fetchAssignee, logActivity } from "../utils";
import { readStorage, writeStorage } from "../../hooks/useLocalStorage";

// Mock local storage hooks used by logActivity
vi.mock("../../hooks/useLocalStorage", () => ({
  readStorage: vi.fn(),
  writeStorage: vi.fn(),
}));

describe("Utils Library", () => {
  const mockNow = new Date("2023-11-01T12:00:00Z");

  beforeEach(() => {
    // Mock current date for consistent date tests
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isOverDue", () => {
    it("returns true when due date is in the past", () => {
      const pastDate = "2023-10-31";
      expect(isOverDue(pastDate)).toBe(true);
    });

    it("returns false when due date is in the future", () => {
      const futureDate = "2023-11-02";
      expect(isOverDue(futureDate)).toBe(false);
    });

    it("returns false when due date is exactly now", () => {
      expect(isOverDue(mockNow.toISOString())).toBe(false);
    });
  });

  describe("isDueToday", () => {
    it("returns true for a date occurring today", () => {
      const todayDate = "2023-11-01";
      expect(isDueToday(todayDate)).toBe(true);
    });

    it("returns false for a date from yesterday", () => {
      const yesterday = "2023-10-31";
      expect(isDueToday(yesterday)).toBe(false);
    });

    it("returns false for a date from tomorrow", () => {
      const tomorrow = "2023-11-02";
      expect(isDueToday(tomorrow)).toBe(false);
    });
  });

  describe("fetchAssignee", () => {
    it("extracts unique assignee names from a list of tasks", () => {
      const tasks = [
        { assignee: "John Doe" },
        { assignee: "Jane Smith" },
        { assignee: "John Doe" }, // Duplicate
        { assignee: "" },         // Empty string
        { title: "No assignee" }  // Missing property
      ];
      
      const result = fetchAssignee(tasks);
      expect(result).toEqual(["John Doe", "Jane Smith"]);
      expect(result).toHaveLength(2);
    });

    it("returns an empty array when input is empty", () => {
      expect(fetchAssignee([])).toEqual([]);
    });
  });

  describe("logActivity", () => {
    it("correctly constructs a log entry and saves it to history", () => {
      const existingHistory = [{ id: "act-old", type: "MOVE" }];
      readStorage.mockReturnValue(existingHistory);

      const action = { type: "CREATE", task: { id: "task-1", title: "Test Task" }, to: "todo" };
      logActivity(action);

      expect(readStorage).toHaveBeenCalledWith("history", []);
      expect(writeStorage).toHaveBeenCalledWith("history", [
        expect.objectContaining({
          type: "CREATE",
          to: "todo",
          id: expect.stringMatching(/^act-/),
          timestamp: expect.any(String),
          task: expect.objectContaining({ id: "task-1", title: "Test Task" })
        }),
        ...existingHistory
      ]);
    });
  });
});