import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export const startStdioMcpServer = async (server: Server): Promise<void> => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP ECharts Server running on stdio");
};