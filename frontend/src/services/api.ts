// Use relative URL so Vite proxy handles the request
const API_BASE_URL = '/api';

export interface QueueEntry {
  id: number;
  queue_number: string;
  type: 'R' | 'W';
  created_at: string;
  status: 'waiting' | 'called' | 'done';
  staff_id: number | null;
}

export interface DashboardData {
  waiting_count: number;
  active_staff_count: number;
  top_staff: Array<{
    name: string;
    total_served: number;
  }>;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async takeQueueNumber(type: 'R' | 'W'): Promise<QueueEntry> {
    return this.request<QueueEntry>('/queue/take', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async callNext(staffId: number): Promise<QueueEntry> {
    return this.request<QueueEntry>('/queue/call', {
      method: 'POST',
      body: JSON.stringify({ staff_id: staffId }),
    });
  }

  async markAsDone(id: number): Promise<QueueEntry> {
    return this.request<QueueEntry>(`/queue/${id}/done`, {
      method: 'PUT',
    });
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }
}

export const apiService = new ApiService();
