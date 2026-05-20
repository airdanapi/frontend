// API Service Layer for Integrator Gateway Console
// Handles all backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ========== Logging Endpoints ==========
  
  async getLogs(filters = {}) {
    return this.get('/integrator/logging', filters);
  }

  async getLogStats() {
    return this.get('/integrator/logging/stats');
  }

  // ========== Fee Endpoints ==========
  
  async getFees(filters = {}) {
    return this.get('/integrator/biaya_layanan_integrasi', filters);
  }

  async getFeeStats(filters = {}) {
    return this.get('/integrator/biaya_layanan_integrasi/stats', filters);
  }

  // ========== Route Registry Endpoints ==========
  
  async getRoutes() {
    return this.get('/integrator/routes');
  }

  async updateRoute(routeId, data) {
    return this.put(`/integrator/routes/${routeId}`, data);
  }

  // ========== Circuit Breaker Endpoints ==========
  
  async getCircuitStates() {
    return this.get('/integrator/circuits');
  }

  // ========== Health Endpoints ==========
  
  async getHealth() {
    return this.get('/health');
  }

  async getReady() {
    return this.get('/ready');
  }

  async getInfo() {
    return this.get('/info');
  }

  // ========== Authentication ==========
  
  async login(email, password) {
    // Mock login for now - replace with actual endpoint when available
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = 'mock-jwt-token-' + Date.now();
        this.setToken(mockToken);
        resolve({
          success: true,
          data: {
            token: mockToken,
            user: {
              id: '1',
              email: email,
              role: 'Operator',
            },
          },
        });
      }, 500);
    });
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  async validateToken() {
    return this.post('/integrator/validasi_request');
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
