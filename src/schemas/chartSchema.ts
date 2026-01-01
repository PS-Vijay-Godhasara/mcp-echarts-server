import { z } from 'zod';
import {
  CategoricalDataSchema,
  TimeSeriesSchema,
  HierarchicalDataSchema,
  GraphDataSchema,
  KeyValueDataSchema,
  MatrixDataSchema,
  CoordinateDataSchema
} from './dataSchema.js';

// Base chart properties
export const BaseChartSchema = z.object({
  title: z.string().optional(),
  width: z.number().min(200).max(4000).default(800),
  height: z.number().min(200).max(4000).default(600),
  theme: z.enum(['light', 'dark']).default('light'),
  outputFormat: z.enum(['svg', 'png_base64']).default('svg'),
  showTooltip: z.boolean().default(true),
  showLegend: z.boolean().default(true)
});

// Chart discriminated union - Core ECharts types only
export const ChartSchema = z.discriminatedUnion('type', [
  // Line Charts
  BaseChartSchema.extend({
    type: z.literal('line'),
    data: z.union([CategoricalDataSchema, TimeSeriesSchema]),
    smooth: z.boolean().optional(),
    area: z.boolean().optional()
  }),
  
  // Bar Charts
  BaseChartSchema.extend({
    type: z.literal('bar'),
    data: CategoricalDataSchema,
    horizontal: z.boolean().optional(),
    stacked: z.boolean().optional()
  }),
  
  // Pie Charts
  BaseChartSchema.extend({
    type: z.literal('pie'),
    data: KeyValueDataSchema,
    radius: z.union([z.string(), z.array(z.string())]).optional()
  }),
  
  // Scatter/Bubble
  BaseChartSchema.extend({
    type: z.literal('scatter'),
    data: CoordinateDataSchema
  }),
  
  BaseChartSchema.extend({
    type: z.literal('effectScatter'),
    data: CoordinateDataSchema
  }),
  
  // Candlestick
  BaseChartSchema.extend({
    type: z.literal('candlestick'),
    data: z.object({
      categories: z.array(z.string()),
      values: z.array(z.tuple([z.number(), z.number(), z.number(), z.number()]))
    })
  }),
  
  // Radar
  BaseChartSchema.extend({
    type: z.literal('radar'),
    data: z.object({
      indicators: z.array(z.object({ name: z.string(), max: z.number() })),
      series: z.array(z.object({ name: z.string(), values: z.array(z.number()) }))
    })
  }),
  
  // Heatmap
  BaseChartSchema.extend({
    type: z.literal('heatmap'),
    data: MatrixDataSchema
  }),
  
  // Tree Charts
  BaseChartSchema.extend({
    type: z.literal('tree'),
    data: HierarchicalDataSchema
  }),
  
  BaseChartSchema.extend({
    type: z.literal('treemap'),
    data: HierarchicalDataSchema
  }),
  
  BaseChartSchema.extend({
    type: z.literal('sunburst'),
    data: HierarchicalDataSchema
  }),
  
  // Graph/Network
  BaseChartSchema.extend({
    type: z.literal('graph'),
    data: GraphDataSchema,
    layout: z.enum(['force', 'circular', 'none']).optional()
  }),
  
  // Funnel
  BaseChartSchema.extend({
    type: z.literal('funnel'),
    data: KeyValueDataSchema
  }),
  
  // Gauge
  BaseChartSchema.extend({
    type: z.literal('gauge'),
    data: z.object({
      value: z.number(),
      name: z.string().optional(),
      min: z.number().default(0),
      max: z.number().default(100)
    })
  }),
  
  // Boxplot
  BaseChartSchema.extend({
    type: z.literal('boxplot'),
    data: z.object({
      categories: z.array(z.string()),
      values: z.array(z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()]))
    })
  }),
  
  // Parallel
  BaseChartSchema.extend({
    type: z.literal('parallel'),
    data: z.object({
      dimensions: z.array(z.object({ name: z.string() })),
      values: z.array(z.array(z.number()))
    })
  }),
  
  // Calendar
  BaseChartSchema.extend({
    type: z.literal('calendar'),
    data: z.array(z.tuple([z.string(), z.number()]))
  })
]);

export type Chart = z.infer<typeof ChartSchema>;
export type ChartType = Chart['type'];