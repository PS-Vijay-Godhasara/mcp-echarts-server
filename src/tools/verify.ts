import { getSupportedCharts, buildChartOption, getChartCapability } from '../charts/index.js';
import { validateChart } from '../utils/validation.js';

export async function verifyApi() {
  const supportedCharts = getSupportedCharts();
  const results = [];
  
  // Specific test data for each chart type
  const getTestData = (chartType: string) => {
    const testDataMap: Record<string, any> = {
      line: {
        type: chartType,
        data: { categories: ['A', 'B', 'C'], series: [{ name: 'Test', values: [1, 2, 3] }] }
      },
      bar: {
        type: chartType,
        data: { categories: ['A', 'B', 'C'], series: [{ name: 'Test', values: [1, 2, 3] }] }
      },
      pie: {
        type: chartType,
        data: [{ name: 'A', value: 10 }, { name: 'B', value: 20 }]
      },
      scatter: {
        type: chartType,
        data: [[1, 2], [3, 4], [5, 6]]
      },
      effectScatter: {
        type: chartType,
        data: [[1, 2], [3, 4], [5, 6]]
      },
      radar: {
        type: chartType,
        data: {
          indicators: [{ name: 'Speed', max: 100 }],
          series: [{ name: 'Test', values: [80] }]
        }
      },
      heatmap: {
        type: chartType,
        data: {
          rows: ['Row1', 'Row2'],
          columns: ['Col1', 'Col2'],
          data: [[1, 2], [3, 4]]
        }
      },
      boxplot: {
        type: chartType,
        data: {
          categories: ['A', 'B'],
          values: [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]]
        }
      },
      candlestick: {
        type: chartType,
        data: {
          categories: ['Day1', 'Day2'],
          values: [[20, 30, 15, 25], [25, 35, 20, 30]]
        }
      },
      parallel: {
        type: chartType,
        data: {
          dimensions: [{ name: 'Dim1' }, { name: 'Dim2' }],
          values: [[1, 2], [3, 4]]
        }
      },
      funnel: {
        type: chartType,
        data: [{ name: 'Step1', value: 100 }, { name: 'Step2', value: 80 }]
      },
      gauge: {
        type: chartType,
        data: { value: 75 }
      },
      tree: {
        type: chartType,
        data: [{ name: 'Root', children: [{ name: 'Child', value: 10 }] }]
      },
      treemap: {
        type: chartType,
        data: [{ name: 'Root', value: 10, children: [{ name: 'Child', value: 5 }] }]
      },
      sunburst: {
        type: chartType,
        data: [{ name: 'Root', children: [{ name: 'Child', value: 10 }] }]
      },
      graph: {
        type: chartType,
        data: {
          nodes: [{ id: '1', name: 'Node1' }, { id: '2', name: 'Node2' }],
          edges: [{ source: '1', target: '2' }]
        }
      },
      calendar: {
        type: chartType,
        data: [['2024-01-01', 100], ['2024-01-02', 200]]
      }
    };
    
    return testDataMap[chartType] || testDataMap.line;
  };
  
  for (const chartType of supportedCharts) {
    try {
      const capability = getChartCapability(chartType);
      const testInput = getTestData(chartType);
      
      if (capability === 'unsupported') {
        results.push({
          type: chartType,
          status: 'skipped',
          capability,
          reason: 'Chart type not supported in SVG SSR mode'
        });
        continue;
      }
      
      // Validate schema
      const validated = validateChart(testInput);
      
      // Build chart option (only for supported charts)
      let option = null;
      if (capability === 'full' || capability === 'requires-asset') {
        option = buildChartOption(validated);
      }
      
      results.push({
        type: chartType,
        status: 'success',
        capability,
        hasOption: !!option,
        hasSeries: !!option?.series || !!option?.geo || !!option?.calendar
      });
    } catch (error) {
      results.push({
        type: chartType,
        status: 'error',
        capability: getChartCapability(chartType),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'error');
  const skipped = results.filter(r => r.status === 'skipped');
  
  const summary = {
    total: supportedCharts.length,
    successful: successful.length,
    failed: failed.length,
    skipped: skipped.length,
    coverage: `${Math.round((successful.length / (supportedCharts.length - skipped.length)) * 100)}%`
  };
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary,
        failed: failed, // Show failed tests for debugging
        skipped: skipped.map(r => ({ type: r.type, reason: r.reason })),
        supportedCharts
      }, null, 2)
    }]
  };
}