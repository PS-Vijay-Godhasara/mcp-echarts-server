import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";

export const startHTTPStreamableServer = async (
  createServer: () => Server,
  endpoint = "/mcp",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }));

  app.get("/health", (_, res) => {
    res.json({ status: "healthy" });
  });

  // ✅ Create single server and transport - let MCP SDK handle lifecycle
  const server = createServer();
  const transport = new StreamableHTTPServerTransport();
  
  await server.connect(transport);

  app.post(endpoint, async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[MCP] 📬 HTTP request received at ${timestamp}`);
    console.log(`[MCP] 📄 Request body:`, JSON.stringify(req.body, null, 2));
    
    try {
      await transport.handleRequest(req, res, req.body);
      console.log(`[MCP] ✅ HTTP request processed successfully`);
    } catch (error) {
      console.log(`[MCP] ❌ HTTP request failed:`, error instanceof Error ? error.message : error);
      throw error;
    }
  });

  app.listen(port, host, () => {
    console.log(`[MCP] ✅ MCP Streamable Server running at http://${host}:${port}${endpoint}`);
    console.log(`[MCP] 🏥 Health check available at http://${host}:${port}/health`);
    console.log(`[MCP] 🔍 Ready to receive MCP requests...`);
  });
};