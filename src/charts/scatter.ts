import type { Chart } from '../schemas/chartSchema.js';

export function buildScatterChart(input: Extract<Chart, { type: 'scatter' }>): Partial<any> {
  const { data } = input;
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return `X: ${params.value[0]}<br/>Y: ${params.value[1]}`;
      }
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: { 
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#e0e6ed'
        }
      }
    },
    yAxis: { 
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#e0e6ed'
        }
      }
    },
    series: [{
      type: 'scatter',
      data: data,
      symbolSize: function (data: number[]) {
        return Math.sqrt(Math.abs(data[1])) * 2 + 5;
      },
      itemStyle: {
        color: function (params: any) {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452'];
          return colors[params.dataIndex % colors.length];
        },
        opacity: 0.7,
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        focus: 'self',
        itemStyle: {
          opacity: 1,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      markLine: {
        lineStyle: {
          type: 'solid'
        },
        data: [
          { type: 'average', name: 'Average X', valueDim: 'x' },
          { type: 'average', name: 'Average Y', valueDim: 'y' }
        ]
      }
    }]
  };
}