import { validateChart } from '../utils/validation.js';
import { ValidationError, SchemaValidationError, UnsupportedChartError, AssetNotFoundError, SSRLimitationError } from '../utils/errors.js';
import { buildChartOption, getSupportedCharts, getChartCapability } from '../charts/index.js';
import { convertSvgToPngBase64, renderEChartsToPngBase64 } from '../utils/svgToPng.js';
import * as echarts from 'echarts/core';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  EffectScatterChart,
  RadarChart,
  HeatmapChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  GraphChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  ParallelChart,
  CandlestickChart,
  ThemeRiverChart,
  PictorialBarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  VisualMapComponent,
  GeoComponent,
  CalendarComponent,
  SingleAxisComponent
} from 'echarts/components';

// Register ECharts components for SVG SSR
echarts.use([
  SVGRenderer,
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  EffectScatterChart,
  RadarChart,
  HeatmapChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  GraphChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  ParallelChart,
  CandlestickChart,
  ThemeRiverChart,
  PictorialBarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  VisualMapComponent,
  GeoComponent,
  CalendarComponent,
  SingleAxisComponent
]);

// ECharts SSR SVG rendering with explicit setup
function renderEChartsToSVG(option: any, width: number, height: number, theme?: string): string {
  // Explicit SSR initialization as documented
  const chart = echarts.init(null as any, theme || null, {
    renderer: 'svg',    // SVG renderer only
    ssr: true,          // Server-side rendering mode
    width,              // Explicit dimensions required
    height
  });

  // Ensure proper grid configuration for full chart area usage
  const finalOption = {
    ...option,
    animation: false,   // Disable animations in SSR
    grid: option.grid || {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: option.legend ? '15%' : '10%',
      containLabel: true
    }
  };

  chart.setOption(finalOption, true);
  const svg = chart.renderToSVGString();
  chart.dispose();
  
  return svg;
}

export async function renderChart(args: any) {
  try {
    const chart = validateChart(args.chart);
    
    // Check chart capability before proceeding
    const capability = getChartCapability(chart.type);
    if (capability === 'unsupported') {
      throw new SSRLimitationError('Chart type not supported', chart.type);
    }
    
    // Handle asset requirements for map charts
    if (capability === 'requires-asset') {
      // No asset-requiring charts in current implementation
    }
    
    const chartOption = buildChartOption(chart);
    
    const width = chart.width || 800;
    const height = chart.height || 600;
    
    // Build final option with proper structure
    const themeColors = chart.theme === 'dark' ? 
      { background: '#1a1a1a', text: '#ffffff' } : 
      { background: '#ffffff', text: '#333333' };
    
    const finalOption = {
      tooltip: chart.showTooltip ? { 
        trigger: ['pie', 'funnel', 'gauge'].includes(chart.type) ? 'item' : 'axis',
        backgroundColor: chart.theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        borderColor: chart.theme === 'dark' ? '#666666' : '#cccccc',
        textStyle: { color: themeColors.text }
      } : undefined,
      legend: chart.showLegend ? { 
        bottom: 10,
        textStyle: { fontSize: 12, color: themeColors.text }
      } : undefined,
      backgroundColor: themeColors.background,
      ...chartOption
    };

    const svg = renderEChartsToSVG(finalOption, width, height, chart.theme);
    
    // Handle output format
    const outputFormat = chart.outputFormat ?? 'svg';
    
    if (outputFormat === 'png_base64') {
      try {
        const pngBase64 = renderEChartsToPngBase64(finalOption, width, height, chart.theme);
        return {
          content: [{
            type: 'image',
            mimeType: 'image/png',
            data: pngBase64
          }]
        };
      } catch (error) {
        throw new SSRLimitationError('PNG generation failed', chart.type);
      }
    }
    
    // Default SVG output
    return {
      content: [{
        type: 'text',
        text: svg
      }]
    };
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof SchemaValidationError || 
        error instanceof UnsupportedChartError ||
        error instanceof AssetNotFoundError ||
        error instanceof SSRLimitationError) {
      throw error.toMcpError();
    }
    throw error;
  }
}

export async function listSupportedCharts() {
  const charts = getSupportedCharts();
  
  return {
    content: [{
      type: 'text',
      text: `Supported chart types: ${charts.join(', ')}`
    }]
  };
}