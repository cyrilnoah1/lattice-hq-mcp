const LATTICE_API_URL = process.env.LATTICE_API_URL || "https://tide.latticehq.com";
const LATTICE_API_TOKEN = process.env.LATTICE_API_TOKEN;

// Only throw error if we're actually trying to use the real client
// This will be checked when the client is actually instantiated and used
function checkApiToken() {
  if (!LATTICE_API_TOKEN) {
    throw new Error("LATTICE_API_TOKEN environment variable is required");
  }
}

export interface LatticeApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  managerId?: string;
  isActive: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: string;
  progress: number;
  dueDate: string;
  createdDate: string;
}

export interface ReviewCycle {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface Feedback {
  id: string;
  content: string;
  authorId: string;
  recipientId: string;
  type: string;
  createdDate: string;
}

class LatticeClient {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    checkApiToken(); // Check token only when making actual requests
    
    const url = `${LATTICE_API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${LATTICE_API_TOKEN}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Lattice API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User operations
  async getUsers(): Promise<User[]> {
    const response = await this.makeRequest<LatticeApiResponse<User[]>>("/v1/users");
    return response.data;
  }

  async getUser(userId: string): Promise<User> {
    const response = await this.makeRequest<LatticeApiResponse<User>>(`/v1/user/${userId}`);
    return response.data;
  }

  async getUserDirectReports(userId: string): Promise<User[]> {
    const response = await this.makeRequest<LatticeApiResponse<User[]>>(`/v1/user/${userId}/directReports`);
    return response.data;
  }

  // Goal operations
  async getGoals(): Promise<Goal[]> {
    const response = await this.makeRequest<LatticeApiResponse<Goal[]>>("/v1/goals");
    return response.data;
  }

  async getGoal(goalId: string): Promise<Goal> {
    const response = await this.makeRequest<LatticeApiResponse<Goal>>(`/v1/goal/${goalId}`);
    return response.data;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    const response = await this.makeRequest<LatticeApiResponse<Goal[]>>(`/v1/user/${userId}/goals`);
    return response.data;
  }

  // Review Cycle operations
  async getReviewCycles(): Promise<ReviewCycle[]> {
    const response = await this.makeRequest<LatticeApiResponse<ReviewCycle[]>>("/v1/reviewCycles");
    return response.data;
  }

  async getReviewCycle(cycleId: string): Promise<ReviewCycle> {
    const response = await this.makeRequest<LatticeApiResponse<ReviewCycle>>(`/v1/reviewCycle/${cycleId}`);
    return response.data;
  }

  async getReviewCycleReviewees(cycleId: string): Promise<User[]> {
    const response = await this.makeRequest<LatticeApiResponse<User[]>>(`/v1/reviewCycle/${cycleId}/reviewees`);
    return response.data;
  }

  // Feedback operations
  async getFeedbacks(): Promise<Feedback[]> {
    const response = await this.makeRequest<LatticeApiResponse<Feedback[]>>("/v1/feedbacks");
    return response.data;
  }

  async getFeedback(feedbackId: string): Promise<Feedback> {
    const response = await this.makeRequest<LatticeApiResponse<Feedback>>(`/v1/feedback/${feedbackId}`);
    return response.data;
  }

  // Department operations
  async getDepartments(): Promise<any[]> {
    const response = await this.makeRequest<LatticeApiResponse<any[]>>("/v1/departments");
    return response.data;
  }

  async getDepartment(departmentId: string): Promise<any> {
    const response = await this.makeRequest<LatticeApiResponse<any>>(`/v1/department/${departmentId}`);
    return response.data;
  }

  // Updates operations
  async getUpdates(): Promise<any[]> {
    const response = await this.makeRequest<LatticeApiResponse<any[]>>("/v1/updates");
    return response.data;
  }

  async getUpdate(updateId: string): Promise<any> {
    const response = await this.makeRequest<LatticeApiResponse<any>>(`/v1/update/${updateId}`);
    return response.data;
  }

  // Get current user
  async getMe(): Promise<User> {
    const response = await this.makeRequest<LatticeApiResponse<User>>("/v1/me");
    return response.data;
  }
}

export const latticeClient = new LatticeClient(); 