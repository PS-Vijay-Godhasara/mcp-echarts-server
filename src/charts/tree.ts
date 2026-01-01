import type { Chart } from '../schemas/chartSchema.js';

export function buildTreeChart(input: Extract<Chart, { type: 'tree' }>): Partial<any> {
  const { data } = input;
  
  return {
    series: [{
      type: 'tree',
      data: data,
      left: '2%',
      right: '2%',
      top: '8%',
      bottom: '20%'
    }]
  };
}