# MCP ECharts Server

A Model Context Protocol server supporting **16 core Apache ECharts chart types** with SVG server-side rendering, theme support, and schema-driven architecture.

## 🚀 Features

- **16 Core Chart Types**: SVG-compatible ECharts charts with reliable server-side rendering
- **Theme Support**: Professional light and dark themes with optimized color palettes
- **Schema-Driven**: Strong TypeScript validation with Zod discriminated unions
- **MCP Compliant**: Full Model Context Protocol support with multiple transports
- **Production Ready**: Clean architecture with comprehensive error handling
- **CLI Testing**: Command-line chart testing with theme selection

## 📊 Supported Chart Types

### Core Analysis Charts
- `line`, `bar`, `pie`, `scatter`, `effectScatter`

### Statistical Charts  
- `radar`, `heatmap`, `boxplot`, `candlestick`, `parallel`

### Hierarchical Charts
- `tree`, `treemap`, `sunburst`

### Network & Specialized Charts
- `graph`, `funnel`, `gauge`, `calendar`

## 🎨 Theme Support

### Light Theme
- Professional blue-green palette: `#5470c6`, `#91cc75`, `#fac858`
- Clean white backgrounds with subtle grids
- Optimized for readability and print

### Dark Theme  
- Vibrant colors: `#4992ff`, `#7cffb2`, `#fddd60`
- Dark backgrounds with enhanced contrast
- Optimized for dark mode interfaces

## 🛠️ MCP Tools

### `render_chart`
Generate SVG charts with theme support
```json
{
  "type": "bar",
  "theme": "dark",
  "title": "Sales Data",
  "data": {
    "categories": ["Q1", "Q2", "Q3", "Q4"],
    "series": [{"name": "Sales", "values": [100, 150, 120, 180]}]
  }
}
```

### `list_supported_charts`
List all 16 supported chart types with capability levels

### `get_capabilities`
Discover server capabilities, theme support, and limitations

### `health_check`
Server health and status monitoring

### `verify_api`
Test all chart types for API completeness and validation

## 🏗️ Architecture

```
src/
├── schemas/          # Zod schemas with theme support
├── charts/           # 16 chart builders with theme integration
├── utils/            # Theme utilities and validation
├── tools/            # MCP tool implementations
└── server.ts         # MCP server with transport support
```

## 🚀 Quick Start

### Installation
```bash
npm install -g @echarts/mcp-echarts-server
```

### Run Server
```bash
# STDIO (default)
mcp-echarts-server

# HTTP Server
mcp-echarts-server --transport streamable --port 1122

# Server-Sent Events
mcp-echarts-server --transport sse --port 1122
```

## 🧪 Testing Charts

### Test Individual Charts
```bash
# Light theme (default)
npm run test:charts -- line
npm run test:charts -- bar

# Dark theme
npm run test:charts -- line --theme=dark
npm run test:charts -- pie --theme=dark
```

### Test All Charts
```bash
# All charts, light theme
npm run test:charts -- --all

# All charts, dark theme
npm run test:charts -- --all --theme=dark
```

### Output
Charts are saved as SVG files: `test-{chartType}-{theme}.svg`

## 📈 Chart Examples

**Line Chart with Area Fill:**
```json
{
  "type": "line",
  "theme": "dark",
  "smooth": true,
  "area": true,
  "data": {
    "categories": ["Mon", "Tue", "Wed"],
    "series": [{"name": "Sales", "values": [150, 230, 224]}]
  }
}
```

**Radar Chart:**
```json
{
  "type": "radar",
  "theme": "light",
  "data": {
    "indicators": [{"name": "Sales", "max": 100}],
    "series": [{"name": "Q1", "values": [80]}]
  }
}
```

## 🔧 Development

```bash
npm install
npm run build
npm run test:charts -- --all
```

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - System design and components
- [Testing Guide](docs/TESTING.md) - Chart testing with CLI
- [Project Summary](docs/PROJECT_SUMMARY.md) - Comprehensive overview

## 📄 License

MIT