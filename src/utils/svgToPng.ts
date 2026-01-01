import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { createCanvas } from '@napi-rs/canvas';
import { SSRLimitationError } from './errors.js';

// Register Canvas renderer for PNG generation
echarts.use([CanvasRenderer]);

export async function convertSvgToPngBase64(
  svg: string,
  width: number,
  height: number
): Promise<string> {
  throw new SSRLimitationError('Use renderEChartsToPngBase64 instead', 'png_base64');
}

export function renderEChartsToPngBase64(
  option: any,
  width: number,
  height: number,
  theme?: string
): string {
  try {
    // Validate dimensions
    if (width > 4000 || height > 4000) {
      throw new SSRLimitationError('PNG conversion size limit exceeded', 'png_base64');
    }

    // Create canvas for ECharts
    const canvas = createCanvas(width, height);
    
    // Initialize ECharts with canvas renderer
    const chart = echarts.init(canvas as any, theme || null, {
      renderer: 'canvas',
      width,
      height
    });

    // Set option and render
    const finalOption = {
      ...option,
      animation: false // Disable animations for static output
    };
    
    chart.setOption(finalOption, true);
    
    // Get PNG buffer directly from canvas
    const pngBuffer = canvas.toBuffer('image/png');
    chart.dispose();

    // Convert buffer to Base64 string
    return pngBuffer.toString('base64');
  } catch (error) {
    throw new SSRLimitationError(
      `PNG generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'png_base64'
    );
  }
}