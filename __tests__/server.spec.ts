import { describe, it, expect } from 'vitest';
import { validateChart } from '../src/utils/validation.js';
import { buildChartOption, getSupportedCharts } from '../src/charts/index.js';
import { OptionBuilder } from '../src/echarts/optionBuilder.js';
import { healthCheck } from '../src/tools/health.js';

describe('MCP ECharts Server', () => {
  describe('Chart Registry', () => {
    it('should have all supported chart types', () => {
      const charts = getSupportedCharts();
      expect(charts).toContain('bar');
      expect(charts).toContain('line');
      expect(charts).toContain('pie');
      expect(charts).toContain('radar');
      expect(charts.length).toBeGreaterThan(10);
    });
  });

  describe('Schema Validation', () => {
    it('should validate bar chart request', () => {
      const request = {
        type: 'bar',
        data: {
          categories: ['A', 'B', 'C'],
          series: [{ name: 'Series 1', values: [1, 2, 3] }]
        }
      };
      
      expect(() => validateChart(request)).not.toThrow();
    });

    it('should reject invalid chart type', () => {
      const request = {
        type: 'invalid',
        data: {}
      };
      
      expect(() => validateChart(request)).toThrow();
    });
  });

  describe('Chart Building', () => {
    it('should build bar chart option', () => {
      const request = {
        type: 'bar' as const,
        data: {
          categories: ['A', 'B', 'C'],
          series: [{ name: 'Test', values: [10, 20, 30] }]
        }
      };
      
      const option = buildChartOption(request);
      expect(option.series[0].type).toBe('bar');
      expect(option.series[0].data).toEqual([10, 20, 30]);
    });
  });

  describe('Option Builder', () => {
    it('should create complete ECharts option', () => {
      const option = OptionBuilder.create('light')
        .title('Test Chart')
        .tooltip()
        .xAxis('category', ['A', 'B', 'C'])
        .yAxis('value')
        .series([{ type: 'bar', data: [1, 2, 3] }])
        .build();

      expect(option.title.text).toBe('Test Chart');
      expect(option.series).toHaveLength(1);
      expect(option.backgroundColor).toBe('#ffffff');
    });
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const result = await healthCheck();
      const status = JSON.parse(result.content[0].text);
      
      expect(status.status).toBe('healthy');
      expect(status.version).toBe('0.9.7');
      expect(status.supportedCharts).toBeGreaterThan(0);
    });
  });
});