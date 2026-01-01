import type { Chart } from '../schemas/chartSchema.js';
import { getThemeColors } from '../utils/themes.js';

export function buildPieChart(input: Extract<Chart, { type: 'pie' }>): Partial<any> {
  const { data, radius, theme = 'light' } = input;
  const themeColors = getThemeColors(theme);
  
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderColor: themeColors.axis,
      textStyle: { color: themeColors.text },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.map(item => item.name),
      textStyle: { color: themeColors.text }
    },
    series: [{
      name: 'Data',
      type: 'pie',
      radius: radius || ['40%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      data: data.map((item, index) => {
        const color = themeColors.primary[index % themeColors.primary.length];
        return {
          name: item.name,
          value: item.value,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [{
                offset: 0, color
              }, {
                offset: 1, color: `${color}80`
              }]
            },
            borderColor: themeColors.background,
            borderWidth: 2
          }
        };
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold',
          color: themeColors.text
        }
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        position: 'outside',
        color: themeColors.text
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 10,
        lineStyle: { color: themeColors.axis }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx: number) {
        return Math.random() * 200;
      }
    }]
  };
}