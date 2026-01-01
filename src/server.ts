import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { renderChart, listSupportedCharts } from './tools/renderChart.js';
import { healthCheck } from './tools/health.js';
import { verifyApi } from './tools/verify.js';
import { getCapabilities } from './tools/capabilities.js';
import { ChartSchema } from './schemas/chartSchema.js';
import { zodToJsonSchema } from './utils/schema.js';
import { startHTTPStreamableServer } from './services/streamable.js';
import { startSSEMcpServer } from './services/sse.js';

function createServer(): Server {
  const server = new Server(
    {
      name: 'mcp-echarts-server',
      version: '0.9.7',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.log('[MCP] 📋 ListTools request received');
    return {
      tools: [
        {
          name: 'render_chart',
          description: 'Generate SVG chart using Apache ECharts with SSR',
          inputSchema: {
            type: 'object',
            properties: {
              chart: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  title: { type: 'string' },
                  data: { type: 'object' }
                },
                required: ['type', 'data']
              }
            },
            required: ['chart']
          }
        },
        {
          name: 'list_supported_charts',
          description: 'List all supported chart types with capability levels',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: 'get_capabilities',
          description: 'Discover server capabilities and chart support matrix',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: 'health_check',
          description: 'Check server health and status',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: 'verify_api',
          description: 'Verify all chart types work correctly (dev tool)',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const timestamp = new Date().toISOString();
    console.log(`[MCP] 🔧 Tool called: ${toolName} at ${timestamp}`);
    
    try {
      let result;
      switch (toolName) {
        case 'render_chart':
          const chartType = (request.params.arguments as any)?.chart?.type;
          console.log(`[MCP] 📊 Rendering ${chartType} chart`);
          result = await renderChart(request.params.arguments);
          break;
        case 'list_supported_charts':
          console.log('[MCP] 📋 Listing supported charts');
          result = await listSupportedCharts();
          break;
        case 'get_capabilities':
          console.log('[MCP] 🔍 Getting server capabilities');
          result = await getCapabilities();
          break;
        case 'health_check':
          console.log('[MCP] 🏥 Health check requested');
          result = await healthCheck();
          break;
        case 'verify_api':
          console.log('[MCP] 🧪 API verification requested');
          result = await verifyApi();
          break;
        default:
          console.log(`[MCP] ❌ Unknown tool: ${toolName}`);
          throw new Error(`Unknown tool: ${toolName}`);
      }
      console.log(`[MCP] ✅ Tool ${toolName} completed successfully`);
      return result;
    } catch (error) {
      console.log(`[MCP] ❌ Tool ${toolName} failed:`, error instanceof Error ? error.message : error);
      throw error;
    }
  });

  return server;
}

export async function runStdioServer() {
  console.log('[MCP] 🚀 Starting MCP ECharts Server on STDIO transport');
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('[MCP] ✅ STDIO server connected and ready');
  
  process.on('SIGINT', async () => {
    console.log('[MCP] 🛑 Shutting down STDIO server...');
    await server.close();
    process.exit(0);
  });
}

export async function runSSEServer(host: string, port: number, endpoint: string) {
  console.log(`[MCP] 🚀 Starting SSE server on http://${host}:${port}${endpoint}`);
  await startSSEMcpServer(createServer, endpoint, port, host);
}

export async function runHTTPStreamableServer(host: string, port: number, endpoint: string) {
  console.log(`[MCP] 🚀 Starting HTTP Streamable server on http://${host}:${port}${endpoint}`);
  await startHTTPStreamableServer(createServer, endpoint, port, host);
}