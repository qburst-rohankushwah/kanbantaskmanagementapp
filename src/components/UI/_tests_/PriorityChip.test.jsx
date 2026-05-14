import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PriorityChip from "../PriorityChip";

describe("PriorityChip Component", () => {
  const mockData = [
    { name: "Low", value: "low", type: "low-style" },
    { name: "Medium", value: "medium", type: "medium-style" },
    { name: "High", value: "high", type: "high-style" },
  ];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all priority options based on data prop", () => {
    render(<PriorityChip data={mockData} onChange={mockOnChange} showSelected={true} />);
    
    mockData.forEach((item) => {
      expect(screen.getByRole("button", { name: item.name })).toBeTruthy();
    });
  });

  it("updates selection and triggers onChange when a chip is clicked", () => {
    render(<PriorityChip data={mockData} onChange={mockOnChange} showSelected={true} />);
    
    const highButton = screen.getByRole("button", { name: "High" });
    fireEvent.click(highButton);

    expect(mockOnChange).toHaveBeenCalledWith({ key: "priority", value: "high" });
  });

  it("applies the selected-chip class only when showSelected is true and currentValue matches", () => {
    const { rerender } = render(
      <PriorityChip data={mockData} onChange={mockOnChange} showSelected={true} currentValue="high" />
    );
    
    const highButton = screen.getByRole("button", { name: "High" });
    expect(highButton.className).toContain("selected-chip");

    rerender(<PriorityChip data={mockData} onChange={mockOnChange} showSelected={false} currentValue="high" />);
    expect(highButton.className).not.toContain("selected-chip");
  });

  it("does not call onChange when showSelected is false", () => {
    render(<PriorityChip data={mockData} onChange={mockOnChange} showSelected={false} />);
    
    const lowButton = screen.getByRole("button", { name: "Low" });
    fireEvent.click(lowButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("applies individual type classes from the data array", () => {
    render(<PriorityChip data={mockData} onChange={mockOnChange} showSelected={true} />);
    
    expect(screen.getByRole("button", { name: "Low" }).className).toContain("low-style");
    expect(screen.getByRole("button", { name: "Medium" }).className).toContain("medium-style");
  });
});