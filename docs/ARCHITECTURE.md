# MCP ECharts Server - Architecture

## Overview

A Model Context Protocol server supporting **16 core Apache ECharts chart types** with SVG server-side rendering, professional theme support, and schema-driven architecture optimized for reliability and performance.

## Architecture

### Directory Structure

```
src/
├── index.ts               # CLI entry point with transport selection
├── server.ts              # MCP server factory and transport handlers
├── tools/                 # MCP tool implementations
│   ├── renderChart.ts    # Main chart rendering with SVG output
│   ├── capabilities.ts   # Capability discovery and support matrix
│   └── listCharts.ts     # Supported chart type listing
├── charts/                # Chart type implementations (16 core types)
│   ├── index.ts          # Chart registry and capability management
│   ├── line.ts           # Line chart with theme support
│   ├── bar.ts            # Bar chart with gradients
│   ├── pie.ts            # Pie chart with radial gradients
│   ├── scatter.ts        # Scatter plot implementation
│   ├── radar.ts          # Radar chart implementation
│   ├── heatmap.ts        # Heatmap implementation
│   ├── tree.ts           # Tree chart implementation
│   ├── treemap.ts        # Treemap implementation
│   ├── sunburst.ts       # Sunburst implementation
│   ├── graph.ts          # Graph/Network implementation
│   ├── funnel.ts         # Funnel chart implementation
│   ├── gauge.ts          # Gauge chart implementation
│   ├── boxplot.ts        # Boxplot implementation
│   ├── candlestick.ts    # Candlestick implementation
│   ├── parallel.ts       # Parallel coordinates implementation
│   └── advanced.ts       # Calendar and effect scatter charts
├── schemas/               # Zod schema definitions
│   ├── chartSchema.ts    # Discriminated union with theme support
│   └── dataSchema.ts     # Data format schemas
├── utils/                 # Utilities and theme system
│   ├── themes.ts         # Professional light/dark theme palettes
│   ├── validation.ts     # Schema validation helpers
│   └── errors.ts         # Custom error classes
└── test-charts.js         # CLI testing tool with theme support
```

### Key Design Principles

1. **SVG-Only Rendering**: Focus on 16 chart types that work reliably with SVG SSR
2. **Theme-Driven Design**: Professional light/dark themes with optimized color palettes
3. **Schema Validation**: Discriminated union with Zod for type-safe chart requests
4. **Capability Transparency**: Clear reporting of what works vs. limitations
5. **CLI Testing**: Command-line testing for development and validation

### Theme System

#### Professional Color Palettes
```typescript
// Light Theme
primary: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
background: '#ffffff'
text: '#333333'
grid: '#f0f0f0'

// Dark Theme  
primary: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9']
background: '#1a1a1a'
text: '#ffffff'
grid: '#333333'
```

#### Theme Integration
- **Automatic Color Assignment**: Charts cycle through theme palette
- **Gradient Generation**: Dynamic gradients based on theme colors
- **Consistent Styling**: Axes, grids, tooltips match theme
- **Accessibility**: High contrast ratios for both themes

### MCP Tools

#### `render_chart`
- **Input**: Chart configuration with optional theme
- **Validation**: Zod schema validation with theme support
- **Processing**: Theme-aware chart building
- **Output**: SVG with embedded styling

#### `list_supported_charts`
- **Output**: Array of 16 supported chart types
- **Capability Levels**: All charts marked as 'full' support

#### `get_capabilities`
- **Renderers**: SVG only
- **Themes**: Light and dark support
- **Limitations**: Clear SSR constraints
- **Max Dimensions**: 4000x4000 pixels

### Chart Support Matrix

#### Core Analysis (5 types)
- `line`: Multi-series with area fill, smooth curves, mark points
- `bar`: Horizontal/vertical, stacked, gradient fills
- `pie`: Radial gradients, custom radius, label positioning
- `scatter`: Dynamic sizing, color variations, correlation analysis
- `effectScatter`: Animated scatter with ripple effects

#### Statistical Analysis (5 types)
- `radar`: Multi-dimensional comparison with polygon areas
- `heatmap`: Matrix visualization with color mapping
- `boxplot`: Statistical distribution analysis
- `candlestick`: Financial OHLC data visualization
- `parallel`: Multi-dimensional parallel coordinates

#### Hierarchical Data (3 types)
- `tree`: Hierarchical tree structures
- `treemap`: Nested rectangles for hierarchical data
- `sunburst`: Radial hierarchical visualization

#### Specialized Charts (3 types)
- `graph`: Network nodes and edges with layouts
- `funnel`: Conversion funnel analysis
- `gauge`: Single-value gauge displays
- `calendar`: Time-series calendar heatmaps

### Server-Side Rendering Setup

```typescript
// ECharts SSR configuration
const chart = echarts.init(null, theme, {
  renderer: 'svg',    // SVG renderer only
  ssr: true,          # Server-side rendering mode
  width,              # Explicit dimensions required
  height
});

// Theme-aware option building
const finalOption = {
  backgroundColor: themeColors.background,
  ...chartOption
};
```

### CLI Testing System

#### Usage Patterns
```bash
# Test specific chart with theme
npm run test:charts -- line --theme=dark

# Test all charts
npm run test:charts -- --all --theme=light
```

#### Output Management
- **Individual SVG Files**: `test-{chartType}-{theme}.svg`
- **Success Reporting**: Clear pass/fail status
- **Error Details**: Specific validation or rendering errors

### Error Handling

```typescript
// Structured error hierarchy
class ValidationError extends Error
class SchemaValidationError extends ValidationError  
class UnsupportedChartError extends Error
class SSRLimitationError extends Error

// MCP error conversion
error.toMcpError() // Converts to MCP-compliant format
```

### Chart Request Flow

1. **Schema Validation**: Zod validates request structure and theme
2. **Theme Resolution**: Apply light/dark theme colors and styling
3. **Chart Building**: Type-specific builder creates ECharts options
4. **SVG Rendering**: ECharts SSR generates themed SVG
5. **Response**: SVG returned as MCP text content

### SSR Limitations

- **No Animations**: Static SVG output only
- **No Interactions**: Hover/click events not supported  
- **Dataset Limits**: Large datasets may cause memory issues
- **No Progressive Rendering**: Full chart rendered at once

### Adding New Chart Types

1. **SVG Compatibility**: Verify chart works with ECharts SVG renderer
2. **Schema Extension**: Add discriminated union case with theme support
3. **Theme Integration**: Implement theme-aware styling
4. **Builder Function**: Create chart-specific builder with theme colors
5. **Registry Update**: Add to chart registry with 'full' capability
6. **Test Data**: Add test case to CLI testing tool

### Benefits

- **Reliable Rendering**: Focus on proven SVG-compatible charts
- **Professional Themes**: High-quality light/dark color schemes
- **Type Safety**: Discriminated unions prevent configuration errors
- **Developer Experience**: CLI testing for rapid iteration
- **Production Ready**: Comprehensive error handling and validation
- **Extensible**: Clean architecture for adding compatible chart types