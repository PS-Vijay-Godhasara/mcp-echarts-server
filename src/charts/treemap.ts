import type { Chart } from '../schemas/chartSchema.js';

export function buildTreemapChart(input: Extract<Chart, { type: 'treemap' }>): Partial<any> {
  const { data } = input;
  
  return {
    series: [{
      type: 'treemap',
      data: data
    }]
  };
}