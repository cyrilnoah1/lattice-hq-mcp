#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import both real and mock clients
import { latticeClient } from "./lattice/client.js";
import { mockLatticeClient } from "./lattice/mock-client.js";
import {
  allTools,
  GetUsersArgs,
  GetUserArgs,
  GetUserDirectReportsArgs,
  GetGoalsArgs,
  GetGoalArgs,
  GetUserGoalsArgs,
  GetReviewCyclesArgs,
  GetReviewCycleArgs,
  GetReviewCycleRevieweesArgs,
  GetFeedbacksArgs,
  GetFeedbackArgs,
  GetDepartmentsArgs,
  GetDepartmentArgs,
  GetUpdatesArgs,
  GetUpdateArgs,
  GetMeArgs,
} from "./lattice/tools.js";

// Determine which client to use
const LATTICE_API_TOKEN = process.env.LATTICE_API_TOKEN;
const useMockClient = !LATTICE_API_TOKEN;

if (useMockClient) {
  console.error("🎭 MOCK MODE: No LATTICE_API_TOKEN found, using mock data");
  console.error("   To use real Lattice API, set LATTICE_API_TOKEN environment variable");
} else {
  console.error("🔗 LIVE MODE: Using real Lattice API");
}

const client = useMockClient ? mockLatticeClient : latticeClient;

const server = new Server(
  {
    name: "lattice-hq-mcp-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    try {
      if (!request.params.arguments) {
        throw new Error("Arguments are required");
      }

      switch (request.params.name) {
        // User tools
        case "lattice_get_users": {
          const response = await client.getUsers();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_user": {
          const args = request.params.arguments as unknown as GetUserArgs;
          if (!args.user_id) {
            throw new Error("user_id is required");
          }
          const response = await client.getUser(args.user_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_user_direct_reports": {
          const args = request.params.arguments as unknown as GetUserDirectReportsArgs;
          if (!args.user_id) {
            throw new Error("user_id is required");
          }
          const response = await client.getUserDirectReports(args.user_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Goal tools
        case "lattice_get_goals": {
          const response = await client.getGoals();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_goal": {
          const args = request.params.arguments as unknown as GetGoalArgs;
          if (!args.goal_id) {
            throw new Error("goal_id is required");
          }
          const response = await client.getGoal(args.goal_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_user_goals": {
          const args = request.params.arguments as unknown as GetUserGoalsArgs;
          if (!args.user_id) {
            throw new Error("user_id is required");
          }
          const response = await client.getUserGoals(args.user_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Review Cycle tools
        case "lattice_get_review_cycles": {
          const response = await client.getReviewCycles();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_review_cycle": {
          const args = request.params.arguments as unknown as GetReviewCycleArgs;
          if (!args.cycle_id) {
            throw new Error("cycle_id is required");
          }
          const response = await client.getReviewCycle(args.cycle_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_review_cycle_reviewees": {
          const args = request.params.arguments as unknown as GetReviewCycleRevieweesArgs;
          if (!args.cycle_id) {
            throw new Error("cycle_id is required");
          }
          const response = await client.getReviewCycleReviewees(args.cycle_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Feedback tools
        case "lattice_get_feedbacks": {
          const response = await client.getFeedbacks();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_feedback": {
          const args = request.params.arguments as unknown as GetFeedbackArgs;
          if (!args.feedback_id) {
            throw new Error("feedback_id is required");
          }
          const response = await client.getFeedback(args.feedback_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Department tools
        case "lattice_get_departments": {
          const response = await client.getDepartments();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_department": {
          const args = request.params.arguments as unknown as GetDepartmentArgs;
          if (!args.department_id) {
            throw new Error("department_id is required");
          }
          const response = await client.getDepartment(args.department_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Updates tools
        case "lattice_get_updates": {
          const response = await client.getUpdates();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        case "lattice_get_update": {
          const args = request.params.arguments as unknown as GetUpdateArgs;
          if (!args.update_id) {
            throw new Error("update_id is required");
          }
          const response = await client.getUpdate(args.update_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        // Current user tool
        case "lattice_get_me": {
          const response = await client.getMe();
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  }
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const mode = useMockClient ? "🎭 MOCK MODE" : "🔗 LIVE MODE";
  console.error(`Lattice HQ MCP Server running on stdio (${mode})`);
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
}); 