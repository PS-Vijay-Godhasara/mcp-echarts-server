import { getSupportedCharts } from '../charts/index.js';

export async function healthCheck() {
  const supportedCharts = getSupportedCharts();
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'healthy',
        version: '0.9.7',
        supportedCharts: supportedCharts.length,
        timestamp: new Date().toISOString()
      }, null, 2)
    }]
  };
}