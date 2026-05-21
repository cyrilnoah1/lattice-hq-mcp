const LATTICE_API_URL = process.env.LATTICE_API_URL;

// Lattice list endpoints return a paginated envelope of this shape.
// Singular endpoints (e.g. GET /v1/me, /v1/user/:id) return the resource
// object directly at the root with no wrapper.
export interface LatticeListResponse<T = any> {
  object: "list";
  data: T[];
  hasMore: boolean;
  endingCursor: string | null;
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

// Common interface for both real and mock clients
export interface ILatticeClient {
  getUsers(): Promise<User[]>;
  getUser(userId: string): Promise<User>;
  getUserDirectReports(userId: string): Promise<User[]>;
  getGoals(): Promise<Goal[]>;
  getGoal(goalId: string): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  getReviewCycles(): Promise<ReviewCycle[]>;
  getReviewCycle(cycleId: string): Promise<ReviewCycle>;
  getReviewCycleReviewees(cycleId: string): Promise<User[]>;
  getFeedbacks(): Promise<Feedback[]>;
  getFeedback(feedbackId: string): Promise<Feedback>;
  getDepartments(): Promise<any[]>;
  getDepartment(departmentId: string): Promise<any>;
  getUpdates(): Promise<any[]>;
  getUpdate(updateId: string): Promise<any>;
  getMe(): Promise<User>;
}

export class LatticeClient implements ILatticeClient {
  private apiToken: string;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.LATTICE_API_TOKEN || '';
    if (!this.apiToken) {
      throw new Error("LATTICE_API_TOKEN is required");
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!LATTICE_API_URL) {
      throw new Error("LATTICE_API_URL environment variable is required");
    }
    const url = `${LATTICE_API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Lattice API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all pages of a Lattice list endpoint, following the cursor until
   * `hasMore` is false. Lattice list endpoints default to `limit=10` and cap
   * at `limit=100`; without this helper, callers would silently receive only
   * the first 10 items of any collection.
   *
   * A MAX_PAGES safety rail caps runaway pagination (e.g. if the API returns
   * `hasMore: true` indefinitely due to a bug). When the cap is hit, we log
   * to stderr and return the items collected so far.
   */
  private async fetchAllPages<T>(endpoint: string): Promise<T[]> {
    const PAGE_SIZE = 100;
    const MAX_PAGES = 100; // safety rail: up to 10,000 items
    const results: T[] = [];
    let cursor: string | null = null;
    let pageCount = 0;

    do {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (cursor) {
        params.set("startingAfter", cursor);
      }
      const path = `${endpoint}?${params.toString()}`;

      const page = await this.makeRequest<LatticeListResponse<T>>(path);
      results.push(...page.data);
      pageCount++;

      if (!page.hasMore) {
        cursor = null;
        break;
      }
      cursor = page.endingCursor;

      if (pageCount >= MAX_PAGES) {
        console.error(
          `⚠️  Lattice pagination: hit MAX_PAGES (${MAX_PAGES}) for ${endpoint}, returning ${results.length} items but more exist. Consider a narrower query.`
        );
        break;
      }
    } while (cursor);

    return results;
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return await this.fetchAllPages<User>("/v1/users");
  }

  async getUser(userId: string): Promise<User> {
    return await this.makeRequest<User>(`/v1/user/${userId}`);
  }

  async getUserDirectReports(userId: string): Promise<User[]> {
    return await this.fetchAllPages<User>(`/v1/user/${userId}/directReports`);
  }

  // Goal operations
  async getGoals(): Promise<Goal[]> {
    return await this.fetchAllPages<Goal>("/v1/goals");
  }

  async getGoal(goalId: string): Promise<Goal> {
    return await this.makeRequest<Goal>(`/v1/goal/${goalId}`);
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return await this.fetchAllPages<Goal>(`/v1/user/${userId}/goals`);
  }

  // Review Cycle operations
  async getReviewCycles(): Promise<ReviewCycle[]> {
    return await this.fetchAllPages<ReviewCycle>("/v1/reviewCycles");
  }

  async getReviewCycle(cycleId: string): Promise<ReviewCycle> {
    return await this.makeRequest<ReviewCycle>(`/v1/reviewCycle/${cycleId}`);
  }

  async getReviewCycleReviewees(cycleId: string): Promise<User[]> {
    return await this.fetchAllPages<User>(`/v1/reviewCycle/${cycleId}/reviewees`);
  }

  // Feedback operations
  async getFeedbacks(): Promise<Feedback[]> {
    return await this.fetchAllPages<Feedback>("/v1/feedbacks");
  }

  async getFeedback(feedbackId: string): Promise<Feedback> {
    return await this.makeRequest<Feedback>(`/v1/feedback/${feedbackId}`);
  }

  // Department operations
  async getDepartments(): Promise<any[]> {
    return await this.fetchAllPages<any>("/v1/departments");
  }

  async getDepartment(departmentId: string): Promise<any> {
    return await this.makeRequest<any>(`/v1/department/${departmentId}`);
  }

  // Updates operations
  async getUpdates(): Promise<any[]> {
    return await this.fetchAllPages<any>("/v1/updates");
  }

  async getUpdate(updateId: string): Promise<any> {
    return await this.makeRequest<any>(`/v1/update/${updateId}`);
  }

  // Get current user
  async getMe(): Promise<User> {
    return await this.makeRequest<User>("/v1/me");
  }
} 