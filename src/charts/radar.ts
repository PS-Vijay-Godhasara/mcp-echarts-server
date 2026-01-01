import type { Chart } from '../schemas/chartSchema.js';

export function buildRadarChart(input: Extract<Chart, { type: 'radar' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    legend: {
      data: data.series.map(series => series.name)
    },
    radar: {
      indicator: data.indicators,
      shape: 'polygon',
      splitNumber: 5,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)']
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(114, 172, 209, 0.6)'
        }
      }
    },
    series: [{
      type: 'radar',
      data: data.series.map(series => ({
        name: series.name,
        value: series.values,
        areaStyle: {
          opacity: 0.3
        }
      }))
    }]
  };
}