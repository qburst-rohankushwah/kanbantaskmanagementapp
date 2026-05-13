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
    expect(result.current.filters).toEqual({
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

  it("updates filters correctly", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });

    const newFilters = {
      priority: ["high", "medium"],
      assignee: ["John Doe"],
      isOverdue: true,
      isDueToday: false,
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it("throws an error when useSearch is used outside of SearchProvider", () => {
    // Silence console error for the expected throw to keep test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSearch())).toThrow("useSearch must be used within a SearchProvider");
    vi.restoreAllMocks();
  });
});