import type { Chart, ChartType } from '../schemas/chartSchema.js';
import { buildBarChart } from './bar.js';
import { buildLineChart } from './line.js';
import { buildPieChart } from './pie.js';
import { buildScatterChart } from './scatter.js';
import { buildRadarChart } from './radar.js';
import { buildHeatmapChart } from './heatmap.js';
import { buildBoxplotChart } from './boxplot.js';
import { buildCandlestickChart } from './candlestick.js';
import { buildFunnelChart } from './funnel.js';
import { buildGaugeChart } from './gauge.js';
import { buildParallelChart } from './parallel.js';
import { buildGraphChart } from './graph.js';
import { buildTreeChart } from './tree.js';
import { buildTreemapChart } from './treemap.js';
import { buildSunburstChart } from './sunburst.js';
import {
  buildEffectScatterChart,
  buildCalendarChart
} from './advanced.js';

type ChartBuilder = (input: any) => Partial<any>;
type ChartCapability = 'full' | 'requires-asset' | 'unsupported';

interface ChartConfig {
  builder: ChartBuilder;
  capability: ChartCapability;
  limitations?: string[];
}

const chartConfigs: Record<ChartType, ChartConfig> = {
  // Full SVG Support
  bar: { builder: buildBarChart, capability: 'full' },
  line: { builder: buildLineChart, capability: 'full' },
  pie: { builder: buildPieChart, capability: 'full' },
  scatter: { builder: buildScatterChart, capability: 'full' },
  effectScatter: { builder: buildEffectScatterChart, capability: 'full' },
  radar: { builder: buildRadarChart, capability: 'full' },
  heatmap: { builder: buildHeatmapChart, capability: 'full' },
  boxplot: { builder: buildBoxplotChart, capability: 'full' },
  candlestick: { builder: buildCandlestickChart, capability: 'full' },
  parallel: { builder: buildParallelChart, capability: 'full' },
  funnel: { builder: buildFunnelChart, capability: 'full' },
  gauge: { builder: buildGaugeChart, capability: 'full' },
  tree: { builder: buildTreeChart, capability: 'full' },
  treemap: { builder: buildTreemapChart, capability: 'full' },
  sunburst: { builder: buildSunburstChart, capability: 'full' },
  graph: { builder: buildGraphChart, capability: 'full' },
  calendar: { builder: buildCalendarChart, capability: 'full' }
};

export function buildChartOption(input: Chart): Partial<any> {
  const config = chartConfigs[input.type];
  if (config.capability === 'unsupported') {
    throw new Error(`Chart type '${input.type}' is not supported in SVG SSR mode`);
  }
  return config.builder(input);
}

export function getSupportedCharts(): ChartType[] {
  return Object.keys(chartConfigs) as ChartType[];
}

export function getChartCapability(chartType: ChartType): ChartCapability {
  return chartConfigs[chartType]?.capability || 'unsupported';
}

export function getChartLimitations(chartType: ChartType): string[] {
  return chartConfigs[chartType]?.limitations || [];
}

export function getSupportedChartsByCapability(capability: ChartCapability): ChartType[] {
  return Object.entries(chartConfigs)
    .filter(([_, config]) => config.capability === capability)
    .map(([type, _]) => type as ChartType);
}