import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ILatticeClient } from "./client.js";

// Tool handler interface
interface ToolWithHandler {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

// User-related tools
export interface GetUsersArgs {}

export const getUsersTool: Tool = {
  name: "lattice_get_users",
  description: "Get all users in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetUserArgs {
  user_id: string;
}

export const getUserTool: Tool = {
  name: "lattice_get_user",
  description: "Get details of a specific user by ID",
  inputSchema: {
    type: "object",
    required: ["user_id"],
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user to retrieve",
      },
    },
  },
};

export interface GetUserDirectReportsArgs {
  user_id: string;
}

export const getUserDirectReportsTool: Tool = {
  name: "lattice_get_user_direct_reports",
  description: "Get direct reports for a specific user",
  inputSchema: {
    type: "object",
    required: ["user_id"],
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user whose direct reports to retrieve",
      },
    },
  },
};

// Goal-related tools
export interface GetGoalsArgs {}

export const getGoalsTool: Tool = {
  name: "lattice_get_goals",
  description: "Get all goals in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetGoalArgs {
  goal_id: string;
}

export const getGoalTool: Tool = {
  name: "lattice_get_goal",
  description: "Get details of a specific goal by ID",
  inputSchema: {
    type: "object",
    required: ["goal_id"],
    properties: {
      goal_id: {
        type: "string",
        description: "The ID of the goal to retrieve",
      },
    },
  },
};

export interface GetUserGoalsArgs {
  user_id: string;
}

export const getUserGoalsTool: Tool = {
  name: "lattice_get_user_goals",
  description: "Get all goals for a specific user",
  inputSchema: {
    type: "object",
    required: ["user_id"],
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user whose goals to retrieve",
      },
    },
  },
};

// Review Cycle tools
export interface GetReviewCyclesArgs {}

export const getReviewCyclesTool: Tool = {
  name: "lattice_get_review_cycles",
  description: "Get all review cycles in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetReviewCycleArgs {
  cycle_id: string;
}

export const getReviewCycleTool: Tool = {
  name: "lattice_get_review_cycle",
  description: "Get details of a specific review cycle by ID",
  inputSchema: {
    type: "object",
    required: ["cycle_id"],
    properties: {
      cycle_id: {
        type: "string",
        description: "The ID of the review cycle to retrieve",
      },
    },
  },
};

export interface GetReviewCycleRevieweesArgs {
  cycle_id: string;
}

export const getReviewCycleRevieweesTool: Tool = {
  name: "lattice_get_review_cycle_reviewees",
  description: "Get all reviewees for a specific review cycle",
  inputSchema: {
    type: "object",
    required: ["cycle_id"],
    properties: {
      cycle_id: {
        type: "string",
        description: "The ID of the review cycle",
      },
    },
  },
};

// Feedback tools
export interface GetFeedbacksArgs {}

export const getFeedbacksTool: Tool = {
  name: "lattice_get_feedbacks",
  description: "Get all feedback in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetFeedbackArgs {
  feedback_id: string;
}

export const getFeedbackTool: Tool = {
  name: "lattice_get_feedback",
  description: "Get details of a specific feedback by ID",
  inputSchema: {
    type: "object",
    required: ["feedback_id"],
    properties: {
      feedback_id: {
        type: "string",
        description: "The ID of the feedback to retrieve",
      },
    },
  },
};

// Department tools
export interface GetDepartmentsArgs {}

export const getDepartmentsTool: Tool = {
  name: "lattice_get_departments",
  description: "Get all departments in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetDepartmentArgs {
  department_id: string;
}

export const getDepartmentTool: Tool = {
  name: "lattice_get_department",
  description: "Get details of a specific department by ID",
  inputSchema: {
    type: "object",
    required: ["department_id"],
    properties: {
      department_id: {
        type: "string",
        description: "The ID of the department to retrieve",
      },
    },
  },
};

// Updates tools
export interface GetUpdatesArgs {}

export const getUpdatesTool: Tool = {
  name: "lattice_get_updates",
  description: "Get all updates in the organization",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export interface GetUpdateArgs {
  update_id: string;
}

export const getUpdateTool: Tool = {
  name: "lattice_get_update",
  description: "Get details of a specific update by ID",
  inputSchema: {
    type: "object",
    required: ["update_id"],
    properties: {
      update_id: {
        type: "string",
        description: "The ID of the update to retrieve",
      },
    },
  },
};

// Current user tool
export interface GetMeArgs {}

export const getMeTool: Tool = {
  name: "lattice_get_me",
  description: "Get current user information",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// Export all tools
export const allTools = [
  getUsersTool,
  getUserTool,
  getUserDirectReportsTool,
  getGoalsTool,
  getGoalTool,
  getUserGoalsTool,
  getReviewCyclesTool,
  getReviewCycleTool,
  getReviewCycleRevieweesTool,
  getFeedbacksTool,
  getFeedbackTool,
  getDepartmentsTool,
  getDepartmentTool,
  getUpdatesTool,
  getUpdateTool,
  getMeTool,
];

// Create tools with handlers
export function createLatticeTools(client: ILatticeClient): ToolWithHandler[] {
  return [
    {
      name: "lattice_get_users",
      description: "Get all users in the organization",
      inputSchema: getUsersTool.inputSchema,
      handler: async (args: GetUsersArgs) => {
        const response = await client.getUsers();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_user",
      description: "Get details of a specific user by ID",
      inputSchema: getUserTool.inputSchema,
      handler: async (args: GetUserArgs) => {
        if (!args.user_id) {
          throw new Error("user_id is required");
        }
        const response = await client.getUser(args.user_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_user_direct_reports",
      description: "Get direct reports for a specific user",
      inputSchema: getUserDirectReportsTool.inputSchema,
      handler: async (args: GetUserDirectReportsArgs) => {
        if (!args.user_id) {
          throw new Error("user_id is required");
        }
        const response = await client.getUserDirectReports(args.user_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_goals",
      description: "Get all goals in the organization",
      inputSchema: getGoalsTool.inputSchema,
      handler: async (args: GetGoalsArgs) => {
        const response = await client.getGoals();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_goal",
      description: "Get details of a specific goal by ID",
      inputSchema: getGoalTool.inputSchema,
      handler: async (args: GetGoalArgs) => {
        if (!args.goal_id) {
          throw new Error("goal_id is required");
        }
        const response = await client.getGoal(args.goal_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_user_goals",
      description: "Get all goals for a specific user",
      inputSchema: getUserGoalsTool.inputSchema,
      handler: async (args: GetUserGoalsArgs) => {
        if (!args.user_id) {
          throw new Error("user_id is required");
        }
        const response = await client.getUserGoals(args.user_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_review_cycles",
      description: "Get all review cycles in the organization",
      inputSchema: getReviewCyclesTool.inputSchema,
      handler: async (args: GetReviewCyclesArgs) => {
        const response = await client.getReviewCycles();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_review_cycle",
      description: "Get details of a specific review cycle by ID",
      inputSchema: getReviewCycleTool.inputSchema,
      handler: async (args: GetReviewCycleArgs) => {
        if (!args.cycle_id) {
          throw new Error("cycle_id is required");
        }
        const response = await client.getReviewCycle(args.cycle_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_review_cycle_reviewees",
      description: "Get all reviewees for a specific review cycle",
      inputSchema: getReviewCycleRevieweesTool.inputSchema,
      handler: async (args: GetReviewCycleRevieweesArgs) => {
        if (!args.cycle_id) {
          throw new Error("cycle_id is required");
        }
        const response = await client.getReviewCycleReviewees(args.cycle_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_feedbacks",
      description: "Get all feedback in the organization",
      inputSchema: getFeedbacksTool.inputSchema,
      handler: async (args: GetFeedbacksArgs) => {
        const response = await client.getFeedbacks();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_feedback",
      description: "Get details of a specific feedback by ID",
      inputSchema: getFeedbackTool.inputSchema,
      handler: async (args: GetFeedbackArgs) => {
        if (!args.feedback_id) {
          throw new Error("feedback_id is required");
        }
        const response = await client.getFeedback(args.feedback_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_departments",
      description: "Get all departments in the organization",
      inputSchema: getDepartmentsTool.inputSchema,
      handler: async (args: GetDepartmentsArgs) => {
        const response = await client.getDepartments();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_department",
      description: "Get details of a specific department by ID",
      inputSchema: getDepartmentTool.inputSchema,
      handler: async (args: GetDepartmentArgs) => {
        if (!args.department_id) {
          throw new Error("department_id is required");
        }
        const response = await client.getDepartment(args.department_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_updates",
      description: "Get all updates in the organization",
      inputSchema: getUpdatesTool.inputSchema,
      handler: async (args: GetUpdatesArgs) => {
        const response = await client.getUpdates();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_update",
      description: "Get details of a specific update by ID",
      inputSchema: getUpdateTool.inputSchema,
      handler: async (args: GetUpdateArgs) => {
        if (!args.update_id) {
          throw new Error("update_id is required");
        }
        const response = await client.getUpdate(args.update_id);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: "lattice_get_me",
      description: "Get current user information",
      inputSchema: getMeTool.inputSchema,
      handler: async (args: GetMeArgs) => {
        const response = await client.getMe();
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      },
    },
  ];
} 