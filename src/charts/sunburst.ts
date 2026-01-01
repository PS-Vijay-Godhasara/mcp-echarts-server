import type { Chart } from '../schemas/chartSchema.js';

export function buildSunburstChart(input: Extract<Chart, { type: 'sunburst' }>): Partial<any> {
  const { data } = input;
  
  return {
    series: [{
      type: 'sunburst',
      data: data,
      radius: [0, '90%']
    }]
  };
}