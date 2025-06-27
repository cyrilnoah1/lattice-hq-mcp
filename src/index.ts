#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { LatticeClient, ILatticeClient } from "./lattice/client.js";
import { MockLatticeClient } from "./lattice/mock-client.js";
import { createLatticeTools } from "./lattice/tools.js";

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    apiKey: process.env.LATTICE_API_TOKEN,
    stdio: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (arg === '--stdio') {
      config.stdio = true;
    } else if (arg.startsWith('--api-key=')) {
      config.apiKey = arg.split('=')[1];
    } else if (arg === '--api-key' && i + 1 < args.length) {
      config.apiKey = args[i + 1];
      i++; // Skip next argument
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Lattice HQ MCP Server

USAGE:
  npx lattice-hq-mcp-server [OPTIONS]

OPTIONS:
  --api-key=<key>    Lattice API token (can also use LATTICE_API_TOKEN env var)
  --stdio            Use stdio transport (required for MCP)
  --help, -h         Show this help message

EXAMPLES:
  # Run with API key
  npx lattice-hq-mcp-server --api-key=your-token --stdio
  
  # Run with environment variable
  LATTICE_API_TOKEN=your-token npx lattice-hq-mcp-server --stdio
  
  # Run in mock mode (no API key needed)
  npx lattice-hq-mcp-server --stdio

CONFIGURATION:
Add to your MCP client config:
{
  "mcpServers": {
    "lattice-hq": {
      "command": "npx",
      "args": ["-y", "lattice-hq-mcp-server", "--api-key=YOUR-TOKEN", "--stdio"]
    }
  }
}

For more information, visit: https://github.com/your-username/lattice-hq-mcp
`);
}

async function main() {
  const config = parseArgs();

  if (config.help) {
    showHelp();
    process.exit(0);
  }

  if (!config.stdio) {
    console.error("Error: --stdio flag is required for MCP operation");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  // Initialize Lattice client (mock mode if no API key)
  let latticeClient: ILatticeClient;
  const useMockMode = !config.apiKey;

  if (useMockMode) {
    console.error("⚠️  No API token provided - running in MOCK MODE");
    console.error("   Set LATTICE_API_TOKEN or use --api-key for real data");
    latticeClient = new MockLatticeClient();
  } else {
    console.error("✅ Using Lattice API with provided token");
    latticeClient = new LatticeClient(config.apiKey);
  }

  // Create MCP server
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

  // Create tools
  const tools = createLatticeTools(latticeClient);

  // Register tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Tool ${request.params.name} not found`);
    }
    return await tool.handler(request.params.arguments || {});
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error(`🚀 Lattice HQ MCP Server running ${useMockMode ? '(Mock Mode)' : '(Live Mode)'}`);
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
}); 