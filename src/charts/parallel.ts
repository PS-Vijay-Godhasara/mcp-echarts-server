import type { Chart } from '../schemas/chartSchema.js';

export function buildParallelChart(input: Extract<Chart, { type: 'parallel' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    parallelAxis: data.dimensions.map((dim, index) => ({
      dim: index,
      name: dim.name
    })),
    series: [{
      type: 'parallel',
      data: data.values
    }]
  };
}