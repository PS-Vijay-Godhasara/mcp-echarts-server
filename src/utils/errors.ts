export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }

  toMcpError() {
    return {
      code: -32602,
      message: this.message,
      data: this.details
    };
  }
}

export class SchemaValidationError extends ValidationError {
  constructor(message: string, public path: string, public code: string) {
    super(`Schema validation failed at ${path}: ${message}`);
    this.name = 'SchemaValidationError';
  }
}

export class UnsupportedChartError extends Error {
  constructor(chartType: string) {
    super(`Chart type '${chartType}' is not supported`);
    this.name = 'UnsupportedChartError';
  }

  toMcpError() {
    return {
      code: -32601,
      message: this.message
    };
  }
}

export class AssetNotFoundError extends Error {
  constructor(assetName: string, assetType: string = 'asset') {
    super(`${assetType} '${assetName}' not found`);
    this.name = 'AssetNotFoundError';
  }

  toMcpError() {
    return {
      code: -32603,
      message: this.message
    };
  }
}

export class SSRLimitationError extends Error {
  constructor(feature: string, chartType: string) {
    super(`Feature '${feature}' is not supported in SSR mode for chart type '${chartType}'`);
    this.name = 'SSRLimitationError';
  }

  toMcpError() {
    return {
      code: -32604,
      message: this.message
    };
  }
}