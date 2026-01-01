import type { Chart } from '../schemas/chartSchema.js';

export function buildGaugeChart(input: Extract<Chart, { type: 'gauge' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    series: [{
      type: 'gauge',
      min: data.min,
      max: data.max,
      data: [{
        value: data.value,
        name: data.name || 'Value'
      }]
    }]
  };
}