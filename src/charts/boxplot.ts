import type { Chart } from '../schemas/chartSchema.js';

export function buildBoxplotChart(input: Extract<Chart, { type: 'boxplot' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    xAxis: {
      type: 'category',
      data: data.categories
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'boxplot',
      data: data.values
    }]
  };
}