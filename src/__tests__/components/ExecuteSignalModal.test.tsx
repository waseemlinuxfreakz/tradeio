import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExecuteSignalModal from '../../components/ExecuteSignalModal';

// Mock LiveCandlestickChart to avoid canvas issues
vi.mock('../../components/LiveCandlestickChart', () => ({
  default: () => <div data-testid="mock-chart">Chart Mock</div>
}));

// Mock lightweight-charts
vi.mock('lightweight-charts', () => ({
  createChart: vi.fn(() => ({
    applyOptions: vi.fn(),
    resize: vi.fn(),
    remove: vi.fn(),
    addCandlestickSeries: vi.fn(() => ({
      setData: vi.fn(),
      update: vi.fn(),
      createPriceLine: vi.fn()
    }))
  }))
}));

describe('ExecuteSignalModal', () => {
  const mockSignal = {
    id: 'test-signal',
    pair: 'BTC/USDT',
    type: 'LONG',
    entry: '45000',
    takeProfit: '48000',
    stopLoss: '42000',
    analyst: {
      name: 'Test Analyst',
      image: 'test.jpg',
      type: 'Expert'
    }
  };

  it('renders signal details correctly', () => {
    render(
      <BrowserRouter>
        <ExecuteSignalModal onClose={() => {}} signalData={mockSignal} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockSignal.pair)).toBeInTheDocument();
    expect(screen.getByText(/take profit/i)).toBeInTheDocument();
    expect(screen.getByText(/stop loss/i)).toBeInTheDocument();
  });

  it('handles form submission', () => {
    const mockClose = vi.fn();
    render(
      <BrowserRouter>
        <ExecuteSignalModal onClose={mockClose} signalData={mockSignal} />
      </BrowserRouter>
    );

    const amountInput = screen.getByPlaceholderText(/enter amount/i);
    const leverageInput = screen.getByPlaceholderText(/enter leverage/i);
    
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(leverageInput, { target: { value: '10' } });
    
    const executeButton = screen.getByRole('button', { name: /execute trade/i });
    fireEvent.click(executeButton);

    expect(mockClose).toHaveBeenCalled();
  });

  it('validates form inputs', () => {
    render(
      <BrowserRouter>
        <ExecuteSignalModal onClose={() => {}} signalData={mockSignal} />
      </BrowserRouter>
    );

    const executeButton = screen.getByRole('button', { name: /execute trade/i });
    fireEvent.click(executeButton);

    // Should show validation errors
    expect(screen.getByText(/enter amount/i)).toBeInTheDocument();
  });
});