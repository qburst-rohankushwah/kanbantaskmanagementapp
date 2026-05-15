import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../index';
import { useTheme } from '../../../contexts/ThemeContext';

// Mock the context hook to control the theme state in tests
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

// Mock the icon components to simplify element detection
vi.mock('../../../assets/Icons/DarkTheme', () => ({
  DarkThemeIcon: () => <div data-testid="dark-icon">Dark Icon</div>,
}));

vi.mock('../../../assets/Icons/LightTheme', () => ({
  LightThemeIcon: () => <div data-testid="light-icon">Light Icon</div>,
}));

describe('ThemeToggle Component', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with light theme mode', () => {
    useTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    // When theme is light, the button aria-label should suggest switching to dark
    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(button).toBeTruthy();
    
    // It should display the DarkThemeIcon (typically a moon) to represent dark mode
    expect(screen.getByTestId('dark-icon')).toBeTruthy();
    expect(screen.queryByTestId('light-icon')).toBeNull();
  });

  it('renders correctly with dark theme mode', () => {
    useTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    // When theme is dark, the button aria-label should suggest switching to light
    const button = screen.getByRole('button', { name: /switch to light theme/i });
    expect(button).toBeTruthy();

    // It should display the LightThemeIcon (typically a sun) to represent light mode
    expect(screen.getByTestId('light-icon')).toBeTruthy();
    expect(screen.queryByTestId('dark-icon')).toBeNull();
  });

  it('triggers toggleTheme when the button is clicked', () => {
    useTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});