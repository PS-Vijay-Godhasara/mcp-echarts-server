import type { Chart } from '../schemas/chartSchema.js';

export function buildHeatmapChart(input: Extract<Chart, { type: 'heatmap' }>): Record<string, unknown> {
  const { data } = input;
  
  const heatmapData = data.data.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => [colIndex, rowIndex, value])
  );
  
  const maxValue = Math.max(...data.data.flat());
  const minValue = Math.min(...data.data.flat());
  
  return {
    xAxis: {
      type: 'category',
      data: data.columns,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: data.rows,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    series: [{
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true,
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
}