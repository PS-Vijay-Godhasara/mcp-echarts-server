import type { Chart } from '../schemas/chartSchema.js';

export function buildFunnelChart(input: Extract<Chart, { type: 'funnel' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    series: [{
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      data: data.map(item => ({
        name: item.name,
        value: item.value
      }))
    }]
  };
}