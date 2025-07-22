import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';

describe('NavigationBar', () => {
  it('renders all navigation items', () => {
    render(
      <BrowserRouter>
        <NavigationBar onQuickAction={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('handles quick action button click', () => {
    const mockQuickAction = vi.fn();
    render(
      <BrowserRouter>
        <NavigationBar onQuickAction={mockQuickAction} />
      </BrowserRouter>
    );

    const quickActionButton = screen.getByRole('button', { name: /quick action/i });
    fireEvent.click(quickActionButton);
    expect(mockQuickAction).toHaveBeenCalled();
  });

  it('navigates to correct routes on click', () => {
    const { container } = render(
      <BrowserRouter>
        <NavigationBar onQuickAction={() => {}} />
      </BrowserRouter>
    );

    const homeButton = screen.getByRole('button', { name: /home/i });
    fireEvent.click(homeButton);
    expect(window.location.pathname).toBe('/dashboard');

    const signalsButton = screen.getByRole('button', { name: /signals/i });
    fireEvent.click(signalsButton);
    expect(window.location.pathname).toBe('/signals');
  });
});