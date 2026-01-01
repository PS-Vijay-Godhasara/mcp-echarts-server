import type { Chart } from '../schemas/chartSchema.js';

export function buildGraphChart(input: Extract<Chart, { type: 'graph' }>): Record<string, unknown> {
  const { data, layout } = input;
  
  return {
    tooltip: {},
    series: [{
      type: 'graph',
      layout: layout || 'none',
      symbolSize: 50,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: data.nodes.map(node => ({
        name: node.name || node.id,
        x: node.x,
        y: node.y,
        value: node.value,
        category: node.category,
        symbolSize: node.symbolSize || 50
      })),
      links: data.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        value: edge.value,
        label: {
          show: true
        },
        lineStyle: {
          width: 2,
          curveness: 0.2
        }
      })),
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }]
  };
}