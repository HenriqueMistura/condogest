const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getHeaders(customHeaders: any = {}) {
  const token = localStorage.getItem('@CondoGest:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}`);
    }
    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error updating data at ${endpoint}`);
    }
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Error deleting data at ${endpoint}`);
    }
    return response.json();
  },
};
