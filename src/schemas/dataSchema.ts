import { z } from 'zod';

// Categorical data
export const CategoricalDataSchema = z.object({
  categories: z.array(z.string()),
  series: z.array(z.object({
    name: z.string(),
    values: z.array(z.number())
  }))
});

// Numeric series
export const NumericSeriesSchema = z.array(z.object({
  name: z.string(),
  data: z.array(z.union([z.number(), z.array(z.number())]))
}));

// Time series
export const TimeSeriesSchema = z.object({
  timestamps: z.array(z.union([z.string(), z.number()])),
  series: z.array(z.object({
    name: z.string(),
    values: z.array(z.number())
  }))
});

// Hierarchical data
export const HierarchicalNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  name: z.string(),
  value: z.number().optional(),
  children: z.array(HierarchicalNodeSchema).optional()
}));

export const HierarchicalDataSchema = z.array(HierarchicalNodeSchema);

// Graph data
export const GraphNodeSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  value: z.number().optional(),
  category: z.number().optional(),
  symbolSize: z.number().optional(),
  x: z.number().optional(),
  y: z.number().optional()
});

export const GraphEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  value: z.number().optional(),
  weight: z.number().optional()
});

export const GraphDataSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema)
});

// Key-value pairs
export const KeyValueDataSchema = z.array(z.object({
  name: z.string(),
  value: z.number()
}));

// Matrix data
export const MatrixDataSchema = z.object({
  rows: z.array(z.string()),
  columns: z.array(z.string()),
  data: z.array(z.array(z.number()))
});

// Coordinate data
export const CoordinateDataSchema = z.array(z.array(z.number()));

export type CategoricalData = z.infer<typeof CategoricalDataSchema>;
export type NumericSeries = z.infer<typeof NumericSeriesSchema>;
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;
export type HierarchicalData = z.infer<typeof HierarchicalDataSchema>;
export type GraphData = z.infer<typeof GraphDataSchema>;
export type KeyValueData = z.infer<typeof KeyValueDataSchema>;
export type MatrixData = z.infer<typeof MatrixDataSchema>;
export type CoordinateData = z.infer<typeof CoordinateDataSchema>;