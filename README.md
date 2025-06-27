# Lattice HQ MCP Server

A Model Context Protocol (MCP) server for Lattice HQ that enables AI models to interact with your Lattice performance management platform.

## Features

This MCP server provides access to the following Lattice HQ capabilities:

### User Management
- Get all users in the organization
- Get specific user details
- Get direct reports for any user
- Get current user information

### Goal Management
- Get all goals in the organization
- Get specific goal details
- Get goals for a specific user

### Review Cycles
- Get all review cycles
- Get specific review cycle details
- Get reviewees for a review cycle

### Feedback
- Get all feedback
- Get specific feedback details

### Departments
- Get all departments
- Get specific department details

### Updates
- Get all updates
- Get specific update details

## Prerequisites

- Node.js 18 or higher
- Lattice HQ account with API access
- Lattice API token

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd lattice-hq-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```bash
LATTICE_API_URL=https://api.latticehq.com
LATTICE_API_TOKEN=your_api_token_here
```

5. Build the project:
```bash
npm run build
```

## Getting Your Lattice API Token

### Method 1: Through Lattice Settings
1. Log in to your Lattice HQ account
2. Go to Settings → Integrations → API (if available)
3. Generate a new API token
4. Copy the token and add it to your `.env` file

### Method 2: Contact Lattice Support
If you don't see "Integrations" under Settings, this usually means:
- Your plan doesn't include API access (typically Enterprise only)
- You don't have admin permissions
- API access needs to be enabled for your account

**Contact Lattice Support:**
- Email: support@lattice.com
- Request API access for your account/plan

### Method 3: Test with Mock Data (No API Token Required)
If you can't access the real API, you can test the MCP server with mock data:
- Simply run the server without setting `LATTICE_API_TOKEN`
- The server will automatically use realistic mock data
- Perfect for testing integrations and development

## Usage

### Running the Server

**With Real API Token:**
```bash
export LATTICE_API_TOKEN=your_token_here
npm start
```

**With Mock Data (for testing):**
```bash
npm start
```
The server will automatically detect if no API token is set and use mock data.

### Using with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

**For Mock Data Testing (no API token required):**
```json
{
  "mcpServers": {
    "lattice-hq": {
      "command": "node",
      "args": ["/path/to/lattice-hq-mcp/dist/index.js"]
    }
  }
}
```

**For Real Lattice API:**
```json
{
  "mcpServers": {
    "lattice-hq": {
      "command": "node",
      "args": ["/path/to/lattice-hq-mcp/dist/index.js"],
      "env": {
        "LATTICE_API_URL": "https://api.latticehq.com",
        "LATTICE_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### Using with Other MCP Clients

This server follows the standard MCP protocol and can be used with any MCP-compatible client.

## Available Tools

### User Tools
- `lattice_get_users` - Get all users
- `lattice_get_user` - Get user by ID
- `lattice_get_user_direct_reports` - Get user's direct reports
- `lattice_get_me` - Get current user

### Goal Tools
- `lattice_get_goals` - Get all goals
- `lattice_get_goal` - Get goal by ID
- `lattice_get_user_goals` - Get goals for a user

### Review Cycle Tools
- `lattice_get_review_cycles` - Get all review cycles
- `lattice_get_review_cycle` - Get review cycle by ID
- `lattice_get_review_cycle_reviewees` - Get reviewees for a cycle

### Feedback Tools
- `lattice_get_feedbacks` - Get all feedback
- `lattice_get_feedback` - Get feedback by ID

### Department Tools
- `lattice_get_departments` - Get all departments
- `lattice_get_department` - Get department by ID

### Update Tools
- `lattice_get_updates` - Get all updates
- `lattice_get_update` - Get update by ID

## Example Usage with AI

Once connected to an AI assistant through MCP, you can ask questions like:

- "Show me all users in the engineering department"
- "What are John Doe's current goals?"
- "Get the status of the Q4 review cycle"
- "Show me recent feedback for my team"
- "Who reports to the VP of Engineering?"

## Development

### Project Structure

```
src/
├── lattice/
│   ├── client.ts      # Lattice API client
│   └── tools.ts       # MCP tool definitions
└── index.ts           # Main MCP server
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run watch
```

## Error Handling

The server includes comprehensive error handling for:
- Invalid API tokens
- Network connectivity issues
- Invalid user/goal/cycle IDs
- API rate limits
- Malformed requests

## Security

- API tokens are required and validated
- All API calls use HTTPS
- Environment variables are used for sensitive configuration
- Input validation on all tool parameters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- This MCP server: Open an issue in this repository
- Lattice HQ API: Contact Lattice support
- MCP protocol: See the [MCP documentation](https://modelcontextprotocol.io)

## Changelog

### v0.0.1
- Initial release
- Support for all major Lattice HQ API endpoints
- Full MCP protocol compliance
- Comprehensive error handling 