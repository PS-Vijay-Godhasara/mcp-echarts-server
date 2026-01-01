import type { Chart } from '../schemas/chartSchema.js';

export function buildCandlestickChart(input: Extract<Chart, { type: 'candlestick' }>): Record<string, unknown> {
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
      type: 'candlestick',
      data: data.values
    }]
  };
}