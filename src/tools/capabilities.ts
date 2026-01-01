import { getSupportedCharts, getChartCapability, getChartLimitations, getSupportedChartsByCapability } from '../charts/index.js';

export async function getCapabilities() {
  const supportedCharts = getSupportedCharts();
  
  // Build chart capabilities dynamically from registry
  const chartCapabilities = Object.fromEntries(
    supportedCharts.map(type => [type, getChartCapability(type)])
  );

  const capabilities = {
    renderers: ['svg'],
    outputFormats: ['svg', 'png_base64'],
    chartTypes: chartCapabilities,
    maxSize: {
      width: 4000,
      height: 4000
    },
    features: {
      animations: false,
      interactions: false,
      themes: ['light', 'dark'],
      serverSideRendering: true,
      pngConversion: 'svg_to_png'
    },

    supportMatrix: {
      full: getSupportedChartsByCapability('full'),
      'requires-asset': getSupportedChartsByCapability('requires-asset'),
      unsupported: getSupportedChartsByCapability('unsupported')
    },
    limitations: [
      'No animations - static SVG output only',
      'No progressive rendering - full chart rendered at once', 
      'Dataset size limits - large datasets may cause memory issues',
      'No interactions - hover/click events not supported'
    ]
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(capabilities, null, 2)
    }]
  };
}