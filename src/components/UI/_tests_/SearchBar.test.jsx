import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "../SearchBar";

describe("SearchBar Component", () => {
  it("renders correctly with placeholder", () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    
    const input = screen.getByPlaceholderText(/search tasks\.\.\./i);
    
    expect(input).toBeTruthy();
    expect(input.className).toContain("searchInput");
  });

  it("displays the correct initial value from props", () => {
    const initialSearch = "Fix layout";
    render(<SearchBar searchTerm={initialSearch} setSearchTerm={() => {}} />);
    
    const input = screen.getByPlaceholderText(/search tasks\.\.\./i);
    
    expect(input.value).toBe(initialSearch);
  });

  it("calls setSearchTerm on every keystroke", () => {
    const mockSetSearchTerm = vi.fn();
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    const input = screen.getByPlaceholderText(/search tasks\.\.\./i);
    
    // Simulate typing "bug"
    fireEvent.change(input, { target: { value: "bug" } });
    
    expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
    expect(mockSetSearchTerm).toHaveBeenCalledWith("bug");
  });
});