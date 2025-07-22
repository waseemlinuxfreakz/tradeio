import { CandlestickData } from 'lightweight-charts';

interface WebSocketHandlers {
  onMessage?: (data: CandlestickData) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 2000;
  private isDestroyed = false;

  constructor(
    private symbol: string,
    private interval: string,
    private handlers: WebSocketHandlers
  ) {}

  public connect(): void {
    if (this.isDestroyed) return;

    try {
      this.handlers.onStateChange?.('connecting');

      const wsUrl = `wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}@kline_${this.interval}m`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleError(error as Event);
    }
  }

  private handleOpen(): void {
    if (this.isDestroyed) return;

    this.handlers.onStateChange?.('connected');
    this.reconnectAttempts = 0;

    // Subscribe to the kline stream
    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: [`${this.symbol.toLowerCase()}@kline_${this.interval}m`],
        id: Date.now()
      };

      try {
        this.ws.send(JSON.stringify(subscribeMessage));
      } catch (error) {
        console.error('Failed to send subscribe message:', error);
        this.handleError(new Event('subscribeerror'));
      }
    }
  }

  private handleMessage(event: MessageEvent): void {
    if (this.isDestroyed) return;

    try {
      const data = JSON.parse(event.data);
      
      // Handle ping/pong
      if (data.ping) {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ pong: data.ping }));
        }
        return;
      }

      // Handle subscription confirmation
      if (data.result === null && data.id) {
        console.log('Subscription confirmed');
        return;
      }

      // Handle kline data
      if (data.k) {
        const candle: CandlestickData = {
          time: data.k.t / 1000,
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c)
        };
        this.handlers.onMessage?.(candle);
      }
    } catch (error) {
      console.error('WebSocket message processing error:', error);
    }
  }

  private handleError(event: Event): void {
    if (this.isDestroyed) return;

    console.error('WebSocket error:', event);
    this.handlers.onStateChange?.('error');
    this.handlers.onError?.(new Error('WebSocket error occurred'));
    
    if (this.ws) {
      try {
        this.ws.close();
      } catch (closeError) {
        console.error('Error closing WebSocket:', closeError);
      }
    }
  }

  private handleClose(): void {
    if (this.isDestroyed) return;

    this.handlers.onStateChange?.('disconnected');
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (this.isDestroyed || this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      return;
    }

    setTimeout(() => {
      if (this.isDestroyed) return;

      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
      this.connect();
    }, this.RECONNECT_DELAY * Math.min(Math.pow(2, this.reconnectAttempts), 5));
  }

  public destroy(): void {
    this.isDestroyed = true;
    
    if (this.ws) {
      try {
        this.ws.close();
      } catch (error) {
        console.error('Error during WebSocket cleanup:', error);
      }
      this.ws = null;
    }
  }
}