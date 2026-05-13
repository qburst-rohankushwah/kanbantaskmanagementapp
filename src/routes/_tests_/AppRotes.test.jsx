import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AppRoutes from '../AppRoutes';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { TaskModalProvider } from '../../contexts/TaskModalContext';
import { SearchProvider } from '../../contexts/SearchContext';

// Mock the Dashboard component to prevent rendering its full tree and dependencies
vi.mock('../../pages/Dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

// Mock the context providers as simple pass-throughs.
// This is crucial because AppRoutes is nested within these providers in App.jsx,
// and even though Dashboard is mocked, the router itself might expect the context chain.
vi.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <>{children}</>,
  useTheme: vi.fn(), // Mock the hook, though not directly used by AppRoutes
}));
vi.mock('../../contexts/TaskModalContext', () => ({
  TaskModalProvider: ({ children }) => <>{children}</>,
  useTaskModal: vi.fn(), // Mock the hook, though not directly used by AppRoutes
}));
vi.mock('../../contexts/SearchContext', () => ({
  SearchProvider: ({ children }) => <>{children}</>,
  useSearch: vi.fn(), // Mock the hook, though not directly used by AppRoutes
}));

describe('AppRoutes', () => {
  // Helper function to render AppRoutes within its necessary providers
  const renderAppRoutes = (initialEntries = ['/']) => {
    render(
      // Mimic the provider structure from App.jsx
      <ThemeProvider>
        <TaskModalProvider>
          <SearchProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <AppRoutes />
            </MemoryRouter>
          </SearchProvider>
        </TaskModalProvider>
      </ThemeProvider>
    );
  };

  it('renders the Dashboard component for the root path', () => {
    renderAppRoutes(['/']);

    // Check that the mocked Dashboard component is rendered
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('does not render Dashboard for a non-existent path', () => {
    renderAppRoutes(['/non-existent-route']);

    // Ensure the Dashboard component is NOT rendered for an unknown route
    expect(screen.queryByTestId('dashboard-page')).toBeNull();
  });
});