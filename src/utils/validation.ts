import { z } from 'zod';
import { ChartSchema, type Chart } from '../schemas/chartSchema.js';
import { ValidationError, SchemaValidationError, UnsupportedChartError } from './errors.js';
import { getSupportedCharts } from '../charts/index.js';

export function validateChart(input: unknown): Chart {
  const result = ChartSchema.safeParse(input);
  
  if (!result.success) {
    const error = result.error.issues[0];
    throw new SchemaValidationError(
      error.message,
      error.path.join('.'),
      error.code
    );
  }
  
  return result.data;
}

export function validateChartType(type: string): void {
  const supportedTypes = getSupportedCharts();
  
  if (!supportedTypes.includes(type as any)) {
    throw new UnsupportedChartError(type);
  }
}

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(result.error.message, result.error.format());
  }
  
  return result.data;
}