import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignalCard from '../../components/signals/SignalCard';

// Mock the chart component to avoid canvas issues
vi.mock('../../components/LiveCandlestickChart', () => ({
  default: () => <div data-testid="mock-chart">Chart Mock</div>
}));

const mockSignal = {
  id: '1',
  pair: 'BTC/USDT',
  type: 'LONG',
  entry: 45000,
  takeProfit: 48500,
  stopLoss: 42500,
  status: 'ACTIVE',
  currentPrice: 45200,
  profit: 0.44,
  metrics: {
    rsi: 65.4,
    macd: 0.0023,
    volume: '2.5M',
    volatility: 'Medium'
  },
  analyst: {
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    badge: "Top Analyst",
    followers: 125600,
    consensus: 92,
    successRate: "92%"
  },
  community: {
    votes: 126500,
    consensus: 80
  },
  description: "Strong bullish momentum detected with increased volume."
};

describe('SignalCard', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignalCard signal={mockSignal} onClick={() => {}} />
      </BrowserRouter>
    );
  });

  it('renders signal pair and type', () => {
    expect(screen.getByText(mockSignal.pair)).toBeInTheDocument();
    expect(screen.getByText(mockSignal.type)).toBeInTheDocument();
  });

  it('displays analyst information', () => {
    expect(screen.getByText(mockSignal.analyst.name)).toBeInTheDocument();
    expect(screen.getByText(mockSignal.analyst.badge)).toBeInTheDocument();
  });

  it('shows consensus data', () => {
    const consensusElements = screen.getAllByText((content, element) => {
      return content.includes(`${mockSignal.analyst.consensus}%`);
    });
    expect(consensusElements.length).toBeGreaterThan(0);

    const communityElements = screen.getAllByText((content, element) => {
      return content.includes(`${mockSignal.community.consensus}%`);
    });
    expect(communityElements.length).toBeGreaterThan(0);
  });

  it('displays price targets', () => {
    const priceElements = screen.getAllByText((content, element) => {
      return content.includes(`$${mockSignal.takeProfit.toLocaleString()}`) ||
             content.includes(`$${mockSignal.stopLoss.toLocaleString()}`);
    });
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('handles click events', () => {
    const mockClick = vi.fn();
    const { container } = render(
      <BrowserRouter>
        <SignalCard signal={mockSignal} onClick={mockClick} />
      </BrowserRouter>
    );
    
    const card = container.firstChild as HTMLElement;
    card.click();
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});