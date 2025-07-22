// Rate limiting and error handling improvements
const API_CONFIG = {
  baseURL: '/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

class APIClient {
  private rateLimiter: Map<string, number> = new Map();
  private readonly maxRequestsPerMinute = 60;

  async request(endpoint: string, options: RequestInit = {}) {
    try {
      // Rate limiting check
      if (this.isRateLimited(endpoint)) {
        throw new Error('Rate limit exceeded');
      }

      const response = await this.fetchWithRetry(endpoint, options);
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.rateLimiter.get(endpoint) || 0;
    
    if (requests >= this.maxRequestsPerMinute) {
      return true;
    }

    this.rateLimiter.set(endpoint, requests + 1);
    setTimeout(() => this.rateLimiter.delete(endpoint), 60000);
    
    return false;
  }

  private async fetchWithRetry(endpoint: string, options: RequestInit, attempt = 1): Promise<Response> {
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (attempt >= API_CONFIG.retryAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * attempt));
      return this.fetchWithRetry(endpoint, options, attempt + 1);
    }
  }

  private handleError(error: any) {
    // Log error to monitoring service
    console.error('API Error:', error);
    
    // Handle offline mode
    if (!navigator.onLine) {
      useOfflineStore.getState().setOfflineData(/* cached data */);
    }
  }
}

export const api = new APIClient();