import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../Button";

describe("Button Component", () => {
  it("renders with the correct label", () => {
    render(<Button label="Test Button" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /test button/i })).toBeDefined();
  });

  it("executes the onClick callback when clicked", () => {
    const mockOnClick = vi.fn();
    render(<Button label="Clickable" onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies both default and custom CSS classes", () => {
    const customClass = "extra-styles";
    render(
      <Button label="Styled" onClick={() => {}} className={customClass} />
    );
    const button = screen.getByRole("button");

    // Default classes from component
    expect(button.className).toContain("px-4");
    expect(button.className).toContain("button");
    // Custom class
    expect(button.className).toContain(customClass);
  });

  it("is of type 'button'", () => {
    render(<Button label="Button" onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("type")).toBe("button");
  });
});