import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartSection from '../../components/dashboard/ChartSection';

// Mock LiveCandlestickChart to avoid canvas issues
vi.mock('../../components/LiveCandlestickChart', () => ({
  default: () => <div data-testid="mock-chart">Chart Mock</div>
}));

describe('ChartSection', () => {
  const defaultProps = {
    signalId: 'test-signal',
    priceLines: {
      takeProfit: 48000,
      stopLoss: 42000,
      currentPrice: 45000
    }
  };

  it('renders chart with price lines', () => {
    render(<ChartSection {...defaultProps} />);
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });

  it('displays community consensus data', () => {
    render(<ChartSection {...defaultProps} />);
    expect(screen.getByText(/community consensus/i)).toBeInTheDocument();
    expect(screen.getByText(/total votes/i)).toBeInTheDocument();
  });

  it('handles voting interactions', () => {
    render(<ChartSection {...defaultProps} />);
    
    const upvoteButton = screen.getByRole('button', { name: /like/i });
    const downvoteButton = screen.getByRole('button', { name: /dislike/i });

    fireEvent.click(upvoteButton);
    expect(upvoteButton).toBeDisabled();

    fireEvent.click(downvoteButton);
    expect(downvoteButton).toBeDisabled();
  });
});