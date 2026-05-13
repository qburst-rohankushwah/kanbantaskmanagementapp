import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('renders the provided count', () => {
    const testCount = 5;
    render(<Badge count={testCount} />);
    
    const badgeElement = screen.getByText(testCount.toString());
    expect(badgeElement).toBeTruthy();
  });

  it('has the correct CSS classes', () => {
    render(<Badge count={10} />);
    
    const badgeElement = screen.getByText('10');
    expect(badgeElement.className).toContain('cardCount');
    expect(badgeElement.className).toContain('circle');
    expect(badgeElement.className).toContain('count');
    expect(badgeElement.className).toContain('fontColor');
  });

  it('renders correctly with zero count', () => {
    render(<Badge count={0} />);
    const badgeElement = screen.getByText('0');
    expect(badgeElement).toBeTruthy();
  });
});