import { renderHook, act } from "@testing-library/react";
import { SearchProvider, useSearch } from "../SearchContext";
import { describe, it, expect, vi } from "vitest";

describe("SearchContext", () => {
  it("provides default values when wrapped in SearchProvider", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.isHistoryOpen).toBe(false);
    expect(result.current.isFilterOpen).toBe(false);
    expect(result.current.boardFilters).toEqual({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
    expect(result.current.sidebarFilters).toEqual({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
  });

  it("updates searchQuery correctly", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setSearchQuery("bug fix");
    });

    expect(result.current.searchQuery).toBe("bug fix");
  });

  it("toggles isHistoryOpen correctly", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setIsHistoryOpen(true);
    });

    expect(result.current.isHistoryOpen).toBe(true);
  });

  it("toggles isFilterOpen correctly", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.setIsFilterOpen(true);
    });

    expect(result.current.isFilterOpen).toBe(true);
  });

  it("updates boardFilters correctly using toggleBoardFilter", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    act(() => {
      result.current.toggleBoardFilter("priority", "high");
    });

    expect(result.current.boardFilters.priority).toContain("high");

    act(() => {
      result.current.toggleBoardFilter("isOverdue");
    });

    expect(result.current.boardFilters.isOverdue).toBe(true);

    act(() => {
      result.current.clearBoardFilters();
    });

    expect(result.current.boardFilters.priority).toEqual([]);
    expect(result.current.boardFilters.isOverdue).toBe(false);
  });


  it("throws an error when useSearch is used outside of SearchProvider", () => {
    // Silence console error for the expected throw to keep test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSearch())).toThrow("useSearch must be used within a SearchProvider");
    vi.restoreAllMocks();
  });
});