import type { Chart } from '../schemas/chartSchema.js';
import { getThemeColors, createGradient } from '../utils/themes.js';

export function buildLineChart(input: Extract<Chart, { type: 'line' }>): Partial<any> {
  const { data, smooth, area, theme = 'light' } = input;
  const themeColors = getThemeColors(theme);
  
  const categories = 'categories' in data ? data.categories : data.timestamps;
  
  return {
    xAxis: { 
      type: 'category', 
      data: categories,
      axisLabel: { 
        rotate: categories.length > 10 ? 45 : 0,
        interval: 0,
        color: themeColors.text
      },
      boundaryGap: false
    },
    yAxis: { 
      type: 'value',
      splitLine: { 
        show: true, 
        lineStyle: { type: 'dashed', color: themeColors.grid } 
      },
      axisLabel: {
        formatter: '{value}',
        color: themeColors.text
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderColor: themeColors.axis,
      textStyle: { color: themeColors.text },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      textStyle: { color: themeColors.text }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    series: data.series.map((series, index) => {
      const color = themeColors.primary[index % themeColors.primary.length];
      return {
        name: series.name,
        type: 'line',
        data: series.values,
        smooth: smooth || false,
        itemStyle: { color },
        lineStyle: { width: 3, color },
        areaStyle: area ? { 
          opacity: 0.3,
          color: createGradient(color, theme)
        } : undefined,
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          focus: 'series'
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          itemStyle: { color }
        }
      };
    })
  };
}