const LATTICE_API_URL = process.env.LATTICE_API_URL;

/**
 * Lightweight reference to another resource — Lattice returns these
 * (rather than inlining the full object) in fields like `manager`,
 * `department`, `author`, etc. The `url` points at the full resource.
 */
export interface LatticeRef {
  id: string;
  object: string;
  url: string;
}

/**
 * A subresource pointer returned on parent objects (e.g. `tasks`,
 * `customAttributes` on User). Only the URL is present — the data is
 * not eagerly loaded and must be fetched separately if needed.
 */
export interface LatticeSubresourceRef {
  object: "list";
  url: string;
}

/**
 * Lattice list endpoints return a paginated envelope of this shape.
 * Singular endpoints (e.g. GET /v1/me, /v1/user/:id) return the resource
 * object directly at the root with no wrapper.
 *
 * The same shape is also used for embedded lists that ARE eagerly loaded
 * onto a parent object (e.g. `owners` on Goal, `targets` on Feedback).
 */
export interface LatticeListResponse<T = any> {
  object: "list";
  data: T[];
  hasMore: boolean;
  endingCursor: string | null;
}

export interface User {
  id: string;
  object: "user";
  url: string;
  manager: LatticeRef | null;
  directReports: LatticeSubresourceRef;
  department: LatticeRef | null;
  name: string;
  preferredName: string | null;
  email: string;
  tasks: LatticeSubresourceRef;
  title: string | null;
  status: string;
  startDate: string | null;
  birthDate: string | null;
  timezone: string | null;
  gender: string | null;
  isAdmin: boolean;
  externalUserId: string | null;
  createdAt: number;
  updatedAt: number;
  customAttributes: LatticeSubresourceRef;
}

export interface Goal {
  id: string;
  object: "goal";
  url: string;
  owners: LatticeListResponse<LatticeRef>;
  department: LatticeRef | null;
  parentGoal: LatticeRef | null;
  childGoals: LatticeListResponse<LatticeRef>;
  tags: LatticeListResponse<any>;
  name: string;
  description: string | null;
  state: string;
  status: string | null;
  goalType: string;
  priority: string | null;
  amountType: string;
  startingAmount: number;
  endingAmount: number;
  currentAmount: number;
  isPrivate: boolean;
  dueDate: string | null;
  startDate: string | null;
  lastUpdatedAt: number | null;
  publishedAt: number | null;
  completedAt: number | null;
  archivedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewCycle {
  id: string;
  object: "reviewCycle";
  url: string;
  creator: LatticeRef;
  reviewees: LatticeSubresourceRef;
  reviews: LatticeSubresourceRef;
  name: string;
  stage: string;
  peerSelectionStartedAt: number | null;
  reviewsStartedAt: number | null;
  reviewsEndedAt: number | null;
  createdAt: number;
  updatedAt: number;
  autocalculatedWeightedScoresEnabled: boolean;
}

export interface Feedback {
  id: string;
  object: "feedback";
  url: string;
  author: LatticeRef;
  targets: LatticeListResponse<LatticeRef>;
  associatedValues: LatticeListResponse<any>;
  feedbackRequest: LatticeRef | null;
  body: string;
  competency: string | null;
  visibility: string;
  isPublic: boolean;
  createdAt: number;
}

export interface Department {
  id: string;
  object: "department";
  url: string;
  name: string;
  description: string | null;
  createdAt: number;
}

export interface UpdateResponse {
  id: string;
  object: "updateResponse";
  question: string;
  answer: string;
}

export interface SentimentResponse {
  id: string;
  object: "sentimentResponse";
  rating: number;
}

export interface Update {
  id: string;
  object: "update";
  url: string;
  author: LatticeRef;
  manager: LatticeRef | null;
  responses: LatticeListResponse<UpdateResponse>;
  sentiment: SentimentResponse | null;
  isPublic: boolean;
  publishedAt: number | null;
  reviewedAt: number | null;
  createdAt: number;
}

export interface RatingScaleEntry {
  value: number;
  descriptor: string;
}

export interface ReviewResponse {
  ratingString: string | null;
  rating: number | null;
  choices: string[] | null;
  comment: string | null;
  commentSentiment: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  object: "review";
  url: string;
  reviewee: LatticeRef;
  reviewer: LatticeRef;
  question: LatticeRef;
  questionRevision: LatticeRef;
  competency: LatticeRef | null;
  goal: LatticeRef | null;
  reviewType: string;
  response: ReviewResponse | null;
  calibratedResponse: ReviewResponse | null;
  submittedAt: number | null;
  declinedAt: number | null;
  calibrationEnded: boolean;
  parentReviewId: string | null;
  isMostRecentDownwardReview: boolean | null;
}

export interface Reviewee {
  id: string;
  object: "reviewee";
  url: string;
  externalUserId: string | null;
  reviewCycle: LatticeRef;
  user: LatticeRef;
  reviews: LatticeSubresourceRef;
  revieweeFacingPDFUrl: string | null;
  managerFacingPDFUrl: string | null;
  closedAt: number | null;
  esignatureGivenAt: number | null;
  createdAt: number;
  updatedAt: number;
  responsesReleasedAt: number | null;
  weightedScore: {
    manual: number | null;
    autoCalculated: number | null;
  };
}

export interface Question {
  id: string;
  object: "question" | "questionRevision";
  url: string;
  body: string;
  description: string | null;
  hasFreeFormText?: boolean;
  ratingScale: RatingScaleEntry[] | null;
  choices: string[] | null;
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
  getReviewCycleReviewees(cycleId: string): Promise<Reviewee[]>;
  getReviewCycleReviews(cycleId: string): Promise<Review[]>;
  getReviewee(revieweeId: string): Promise<Reviewee>;
  getRevieweeReviews(revieweeId: string): Promise<Review[]>;
  getQuestion(questionId: string): Promise<Question>;
  getFeedbacks(): Promise<Feedback[]>;
  getFeedback(feedbackId: string): Promise<Feedback>;
  getDepartments(): Promise<Department[]>;
  getDepartment(departmentId: string): Promise<Department>;
  getUpdates(): Promise<Update[]>;
  getUpdate(updateId: string): Promise<Update>;
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

  async getReviewCycleReviewees(cycleId: string): Promise<Reviewee[]> {
    return await this.fetchAllPages<Reviewee>(`/v1/reviewCycle/${cycleId}/reviewees`);
  }

  async getReviewCycleReviews(cycleId: string): Promise<Review[]> {
    return await this.fetchAllPages<Review>(`/v1/reviewCycle/${cycleId}/reviews`);
  }

  async getReviewee(revieweeId: string): Promise<Reviewee> {
    return await this.makeRequest<Reviewee>(`/v1/reviewee/${revieweeId}`);
  }

  async getRevieweeReviews(revieweeId: string): Promise<Review[]> {
    return await this.fetchAllPages<Review>(`/v1/reviewee/${revieweeId}/reviews`);
  }

  async getQuestion(questionId: string): Promise<Question> {
    return await this.makeRequest<Question>(`/v1/question/${questionId}`);
  }

  // Feedback operations
  async getFeedbacks(): Promise<Feedback[]> {
    return await this.fetchAllPages<Feedback>("/v1/feedbacks");
  }

  async getFeedback(feedbackId: string): Promise<Feedback> {
    return await this.makeRequest<Feedback>(`/v1/feedback/${feedbackId}`);
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await this.fetchAllPages<Department>("/v1/departments");
  }

  async getDepartment(departmentId: string): Promise<Department> {
    return await this.makeRequest<Department>(`/v1/department/${departmentId}`);
  }

  // Updates operations
  async getUpdates(): Promise<Update[]> {
    return await this.fetchAllPages<Update>("/v1/updates");
  }

  async getUpdate(updateId: string): Promise<Update> {
    return await this.makeRequest<Update>(`/v1/update/${updateId}`);
  }

  // Get current user
  async getMe(): Promise<User> {
    return await this.makeRequest<User>("/v1/me");
  }
} 