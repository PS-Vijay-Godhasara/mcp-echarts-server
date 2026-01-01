import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { type Request, type Response } from "express";

export const startSSEMcpServer = async (
  createServer: () => Server,
  endpoint = "/sse",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());

  const connections: Record<string, SSEServerTransport> = {};

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', version: '0.9.7' });
  });

  app.get(endpoint, async (req: Request, res: Response) => {
    console.log(`[MCP] 🔗 SSE connection initiated from ${req.ip}`);
    const server = createServer();

    const transport = new SSEServerTransport("/messages", res);
    connections[transport.sessionId] = transport;

    transport.onclose = () => {
      delete connections[transport.sessionId];
      console.log(`[MCP] 🔌 SSE Server disconnected: sessionId=${transport.sessionId}`);
    };

    await server.connect(transport);
    console.log(`[MCP] ✅ SSE Server connected: sessionId=${transport.sessionId}`);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      console.warn("SSE Server sessionId parameter is missing");
      return res.status(400).send("Missing sessionId parameter");
    }

    const transport = connections[sessionId];
    if (!transport) {
      console.warn(`SSE Server session not found: sessionId=${sessionId}`);
      return res.status(404).send("Session not found");
    }

    try {
      console.log(`[MCP] 📬 SSE message received: sessionId=${sessionId}`);
      await transport.handlePostMessage(req, res, req.body);
      console.log(`[MCP] ✅ SSE message processed: sessionId=${sessionId}`);
    } catch (e) {
      console.error("[MCP] ❌ SSE Server error handling message:", e);
      if (!res.headersSent) res.status(500).send("Error handling request");
    }
  });

  app.listen(port, host, () => {
    console.log(`[MCP] ✅ MCP SSE Server listening on http://${host}:${port}${endpoint}`);
    console.log(`[MCP] 🏥 Health check available at http://${host}:${port}/health`);
    console.log(`[MCP] 🔍 Ready to receive SSE connections...`);
  });
};