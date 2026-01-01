import type { Chart } from '../schemas/chartSchema.js';
import { getThemeColors, createGradient } from '../utils/themes.js';

export function buildBarChart(input: Extract<Chart, { type: 'bar' }>): Record<string, unknown> {
  const { data, horizontal, stacked, theme = 'light' } = input;
  const themeColors = getThemeColors(theme);
  
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderColor: themeColors.axis,
      textStyle: { color: themeColors.text },
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: unknown[]) => {
        let result = `${(params as any)[0].name}<br/>`;
        for (const param of params as any[]) {
          result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
        }
        return result;
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
    xAxis: horizontal ? { 
      type: 'value',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: themeColors.grid } },
      axisLabel: { formatter: '{value}', color: themeColors.text }
    } : { 
      type: 'category', 
      data: data.categories,
      axisLabel: { 
        rotate: data.categories.length > 10 ? 45 : 0,
        interval: 0,
        color: themeColors.text
      }
    },
    yAxis: horizontal ? { 
      type: 'category', 
      data: data.categories,
      axisLabel: { rotate: 0, color: themeColors.text }
    } : { 
      type: 'value',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: themeColors.grid } },
      axisLabel: { formatter: '{value}', color: themeColors.text }
    },
    series: data.series.map((series, index) => {
      const color = themeColors.primary[index % themeColors.primary.length];
      return {
        name: series.name,
        type: 'bar',
        data: series.values,
        stack: stacked ? 'total' : undefined,
        barWidth: stacked ? '60%' : undefined,
        itemStyle: {
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          color: createGradient(color, theme)
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        markLine: {
          data: [
            { type: 'average', name: 'Avg' }
          ],
          lineStyle: { color }
        }
      };
    })
  };
}