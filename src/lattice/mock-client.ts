// Mock client for testing without real Lattice API access
import { User, Goal, ReviewCycle, Feedback, ILatticeClient } from './client.js';

export interface MockLatticeApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "user1",
    email: "john.doe@company.com",
    firstName: "John",
    lastName: "Doe",
    title: "Senior Software Engineer",
    department: "Engineering",
    managerId: "user3",
    isActive: true
  },
  {
    id: "user2",
    email: "jane.smith@company.com",
    firstName: "Jane",
    lastName: "Smith",
    title: "Product Manager",
    department: "Product",
    managerId: "user3",
    isActive: true
  },
  {
    id: "user3",
    email: "mike.johnson@company.com",
    firstName: "Mike",
    lastName: "Johnson",
    title: "Engineering Manager",
    department: "Engineering",
    managerId: undefined,
    isActive: true
  }
];

const mockGoals: Goal[] = [
  {
    id: "goal1",
    title: "Improve API Performance",
    description: "Reduce API response time by 30%",
    userId: "user1",
    status: "In Progress",
    progress: 65,
    dueDate: "2024-03-31",
    createdDate: "2024-01-01"
  },
  {
    id: "goal2",
    title: "Launch New Feature",
    description: "Successfully launch the new dashboard feature",
    userId: "user2",
    status: "In Progress",
    progress: 40,
    dueDate: "2024-02-29",
    createdDate: "2024-01-15"
  }
];

const mockReviewCycles: ReviewCycle[] = [
  {
    id: "cycle1",
    name: "Q1 2024 Performance Review",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    type: "Performance"
  },
  {
    id: "cycle2",
    name: "Mid-Year Review 2024",
    status: "Upcoming",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    type: "Mid-Year"
  }
];

const mockFeedback: Feedback[] = [
  {
    id: "feedback1",
    content: "Great work on the API optimization project. The performance improvements are significant.",
    authorId: "user3",
    recipientId: "user1",
    type: "Positive",
    createdDate: "2024-01-20"
  },
  {
    id: "feedback2",
    content: "Your presentation to the stakeholders was well-prepared and engaging.",
    authorId: "user3",
    recipientId: "user2",
    type: "Positive",
    createdDate: "2024-01-18"
  }
];

const mockDepartments = [
  { id: "dept1", name: "Engineering", description: "Software development team" },
  { id: "dept2", name: "Product", description: "Product management team" },
  { id: "dept3", name: "Design", description: "User experience team" }
];

const mockUpdates = [
  {
    id: "update1",
    title: "Weekly Progress Update",
    content: "Completed API optimization tasks ahead of schedule",
    authorId: "user1",
    createdDate: "2024-01-22"
  },
  {
    id: "update2",
    title: "Feature Launch Update",
    content: "Dashboard feature is 40% complete, on track for February launch",
    authorId: "user2",
    createdDate: "2024-01-21"
  }
];

export class MockLatticeClient implements ILatticeClient {
  // User operations
  async getUsers(): Promise<User[]> {
    console.log("🎭 Mock: Getting all users");
    return mockUsers;
  }

  async getUser(userId: string): Promise<User> {
    console.log(`🎭 Mock: Getting user ${userId}`);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return user;
  }

  async getUserDirectReports(userId: string): Promise<User[]> {
    console.log(`🎭 Mock: Getting direct reports for user ${userId}`);
    return mockUsers.filter(u => u.managerId === userId);
  }

  // Goal operations
  async getGoals(): Promise<Goal[]> {
    console.log("🎭 Mock: Getting all goals");
    return mockGoals;
  }

  async getGoal(goalId: string): Promise<Goal> {
    console.log(`🎭 Mock: Getting goal ${goalId}`);
    const goal = mockGoals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`);
    }
    return goal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    console.log(`🎭 Mock: Getting goals for user ${userId}`);
    return mockGoals.filter(g => g.userId === userId);
  }

  // Review Cycle operations
  async getReviewCycles(): Promise<ReviewCycle[]> {
    console.log("🎭 Mock: Getting all review cycles");
    return mockReviewCycles;
  }

  async getReviewCycle(cycleId: string): Promise<ReviewCycle> {
    console.log(`🎭 Mock: Getting review cycle ${cycleId}`);
    const cycle = mockReviewCycles.find(c => c.id === cycleId);
    if (!cycle) {
      throw new Error(`Review cycle ${cycleId} not found`);
    }
    return cycle;
  }

  async getReviewCycleReviewees(cycleId: string): Promise<User[]> {
    console.log(`🎭 Mock: Getting reviewees for cycle ${cycleId}`);
    // Return all active users for mock purposes
    return mockUsers.filter(u => u.isActive);
  }

  // Feedback operations
  async getFeedbacks(): Promise<Feedback[]> {
    console.log("🎭 Mock: Getting all feedback");
    return mockFeedback;
  }

  async getFeedback(feedbackId: string): Promise<Feedback> {
    console.log(`🎭 Mock: Getting feedback ${feedbackId}`);
    const feedback = mockFeedback.find(f => f.id === feedbackId);
    if (!feedback) {
      throw new Error(`Feedback ${feedbackId} not found`);
    }
    return feedback;
  }

  // Department operations
  async getDepartments(): Promise<any[]> {
    console.log("🎭 Mock: Getting all departments");
    return mockDepartments;
  }

  async getDepartment(departmentId: string): Promise<any> {
    console.log(`🎭 Mock: Getting department ${departmentId}`);
    const dept = mockDepartments.find(d => d.id === departmentId);
    if (!dept) {
      throw new Error(`Department ${departmentId} not found`);
    }
    return dept;
  }

  // Updates operations
  async getUpdates(): Promise<any[]> {
    console.log("🎭 Mock: Getting all updates");
    return mockUpdates;
  }

  async getUpdate(updateId: string): Promise<any> {
    console.log(`🎭 Mock: Getting update ${updateId}`);
    const update = mockUpdates.find(u => u.id === updateId);
    if (!update) {
      throw new Error(`Update ${updateId} not found`);
    }
    return update;
  }

  // Get current user (mock)
  async getMe(): Promise<User> {
    console.log("🎭 Mock: Getting current user");
    return mockUsers[0]; // Return first user as "current user"
  }
} 