import type { Chart } from '../schemas/chartSchema.js';

export function buildEffectScatterChart(input: Extract<Chart, { type: 'effectScatter' }>): Record<string, unknown> {
  const { data } = input;
  
  return {
    xAxis: { type: 'value' },
    yAxis: { type: 'value' },
    series: [{
      type: 'effectScatter',
      data: data
    }]
  };
}

export function buildCalendarChart(input: Extract<Chart, { type: 'calendar' }>): Record<string, unknown> {
  const { data } = input;
  const year = new Date(data[0][0]).getFullYear();
  
  return {
    title: {
      text: `Calendar Heatmap ${year}`,
      left: 'center'
    },
    calendar: {
      range: year.toString(),
      cellSize: ['auto', 20]
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map(item => item[1])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '10%'
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data
    }]
  };
}