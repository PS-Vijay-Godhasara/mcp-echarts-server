import { renderChart } from './build/tools/renderChart.js';
import { getSupportedCharts } from './build/charts/index.js';
import { writeFileSync } from 'node:fs';

// Parse command line arguments
const args = process.argv.slice(2);
const allCharts = args.includes('--all');
const themeArg = args.find(arg => arg.startsWith('--theme='));
const theme = themeArg ? themeArg.split('=')[1] : 'light';
const formatArg = args.find(arg => arg.startsWith('--format='));
const outputFormat = formatArg ? formatArg.split('=')[1] : 'svg';
const chartType = args.find(arg => !arg.startsWith('--'));

if (!chartType && !allCharts) {
  console.log('Usage: npm run test:charts -- [chart-type] [--theme=light|dark] [--format=svg|png_base64] [--all]');
  console.log('Examples:');
  console.log('  npm run test:charts -- line');
  console.log('  npm run test:charts -- bar --theme=dark');
  console.log('  npm run test:charts -- pie --format=png_base64');
  console.log('  npm run test:charts -- --all');
  console.log('  npm run test:charts -- --all --theme=dark --format=png_base64');
  process.exit(1);
}

const getTestData = (chartType, theme = 'light', outputFormat = 'svg') => {
  const testDataMap = {
    line: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      outputFormat,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      data: { 
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
        series: [
          { name: 'Sales', values: [150, 230, 224, 218, 135, 147, 260] },
          { name: 'Revenue', values: [120, 182, 191, 234, 290, 330, 310] }
        ] 
      },
      smooth: true,
      area: true
    },
    bar: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      outputFormat,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      data: { 
        categories: ['Q1', 'Q2', 'Q3', 'Q4'], 
        series: [
          { name: 'Product A', values: [120, 200, 150, 80] },
          { name: 'Product B', values: [70, 110, 130, 160] },
          { name: 'Product C', values: [90, 140, 110, 120] }
        ] 
      },
      stacked: true
    },
    pie: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      outputFormat,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      data: [
        { name: 'Desktop', value: 1048 }, 
        { name: 'Mobile', value: 735 },
        { name: 'Tablet', value: 580 },
        { name: 'Smart TV', value: 484 },
        { name: 'Others', value: 300 }
      ],
      radius: ['30%', '70%']
    },
    scatter: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [
        [10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81], [11.0, 8.33], 
        [14.0, 7.66], [13.4, 6.81], [10.0, 6.33], [14.0, 8.96], [12.5, 6.82],
        [5.56, 4.26], [7.91, 6.13], [6.89, 5.73], [8.81, 7.71], [8.04, 6.04],
        [6.71, 5.39], [5.76, 4.69], [7.16, 6.22], [4.26, 3.24], [10.84, 9.13]
      ]
    },
    effectScatter: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [[172.7, 105.2], [153.4, 42], [161.2, 51.6], [167.5, 59.0], [159.5, 49.2]]
    },
    radar: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: {
        indicators: [
          { name: 'Sales', max: 6500 }, 
          { name: 'Administration', max: 16000 }, 
          { name: 'IT', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 }
        ],
        series: [
          { name: 'Allocated Budget', values: [4200, 3000, 20000, 35000, 50000, 18000] },
          { name: 'Actual Spending', values: [5000, 14000, 28000, 26000, 42000, 21000] }
        ]
      }
    },
    graph: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: {
        nodes: [
          { id: '1', name: 'Node 1', x: 300, y: 300 },
          { id: '2', name: 'Node 2', x: 800, y: 300 },
          { id: '3', name: 'Node 3', x: 550, y: 100 },
          { id: '4', name: 'Node 4', x: 550, y: 500 }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
          { source: '1', target: '3' },
          { source: '2', target: '4' }
        ]
      },
      layout: 'none'
    },
    heatmap: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: {
        rows: ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'],
        columns: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'],
        data: [[5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 2], [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2], [7, 3, 0, 0, 0, 0, 0, 0, 1, 0, 5, 4], [1, 3, 0, 0, 0, 1, 0, 0, 0, 2, 4, 4], [2, 1, 0, 3, 0, 0, 0, 0, 2, 0, 4, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]]
      }
    },
    boxplot: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: { categories: ['A', 'B'], values: [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]] }
    },
    candlestick: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: { categories: ['Day1', 'Day2'], values: [[20, 30, 15, 25], [25, 35, 20, 30]] }
    },
    parallel: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: { dimensions: [{ name: 'Dim1' }, { name: 'Dim2' }], values: [[1, 2], [3, 4]] }
    },
    funnel: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [
        { name: 'Website Visits', value: 100 },
        { name: 'Downloads', value: 80 },
        { name: 'Requested Price List', value: 60 },
        { name: 'Invoice Sent', value: 40 },
        { name: 'Closed Deals', value: 20 }
      ]
    },
    gauge: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: { value: 75 }
    },
    tree: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [{
        name: 'Root',
        children: [
          {
            name: 'Branch A',
            children: [
              { name: 'Leaf A1', value: 10 },
              { name: 'Leaf A2', value: 20 }
            ]
          },
          {
            name: 'Branch B',
            children: [
              { name: 'Leaf B1', value: 15 },
              { name: 'Leaf B2', value: 25 }
            ]
          }
        ]
      }]
    },
    treemap: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [{
        name: 'Root',
        value: 100,
        children: [
          { name: 'Technology', value: 40, children: [{ name: 'JavaScript', value: 25 }, { name: 'Python', value: 15 }] },
          { name: 'Design', value: 30, children: [{ name: 'UI/UX', value: 20 }, { name: 'Graphics', value: 10 }] },
          { name: 'Marketing', value: 30, children: [{ name: 'Digital', value: 20 }, { name: 'Traditional', value: 10 }] }
        ]
      }]
    },
    sunburst: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [{
        name: 'Root',
        children: [
          {
            name: 'Technology',
            value: 40,
            children: [
              { name: 'Frontend', value: 25 },
              { name: 'Backend', value: 15 }
            ]
          },
          {
            name: 'Business',
            value: 60,
            children: [
              { name: 'Sales', value: 35 },
              { name: 'Marketing', value: 25 }
            ]
          }
        ]
      }]
    },
    calendar: {
      type: chartType,
      width: 800,
      height: 400,
      theme,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      data: [['2024-01-01', 100], ['2024-01-02', 200]]
    }
  };
  
  return testDataMap[chartType] || testDataMap.line;
};

async function testSingleChart(chartType, theme, outputFormat) {
  console.log(`Testing ${chartType} chart with ${theme} theme, ${outputFormat} format...`);
  
  try {
    const chartData = getTestData(chartType, theme, outputFormat);
    const result = await renderChart({ chart: chartData });
    
    if (result.content?.[0]) {
      const content = result.content[0];
      
      if (outputFormat === 'png_base64') {
        if (content.type === 'image' && content.mimeType === 'image/png' && content.data) {
          const filename = `test-${chartType}-${theme}.png`;
          const pngBuffer = Buffer.from(content.data, 'base64');
          writeFileSync(filename, pngBuffer);
          console.log(`✅ Generated ${filename}`);
          return true;
        } else {
          console.log('❌ Error: Invalid PNG response format');
          return false;
        }
      } else {
        if (content.type === 'text' && content.text) {
          const filename = `test-${chartType}-${theme}.svg`;
          writeFileSync(filename, content.text);
          console.log(`✅ Generated ${filename}`);
          return true;
        } else {
          console.log('❌ Error: Invalid SVG response format');
          return false;
        }
      }
    }
    console.log("❌ Error: No content returned");
    return false;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testAllCharts(theme, outputFormat) {
  const supportedCharts = getSupportedCharts();
  console.log(`Testing all ${supportedCharts.length} charts with ${theme} theme, ${outputFormat} format...\n`);
  
  let successCount = 0;
  
  for (const chartType of supportedCharts) {
    const success = await testSingleChart(chartType, theme, outputFormat);
    if (success) successCount++;
  }
  
  console.log(`\n✅ Successfully generated: ${successCount}/${supportedCharts.length} charts`);
  console.log(`Success rate: ${Math.round((successCount/supportedCharts.length)*100)}%`);
}

// Main execution
if (allCharts) {
  testAllCharts(theme, outputFormat).catch(console.error);
} else if (chartType) {
  const supportedCharts = getSupportedCharts();
  if (!supportedCharts.includes(chartType)) {
    console.log(`❌ Unsupported chart type: ${chartType}`);
    console.log(`Supported types: ${supportedCharts.join(', ')}`);
    process.exit(1);
  }
  testSingleChart(chartType, theme, outputFormat).catch(console.error);
}