import { getTheme, type Theme } from './themes.js';

export interface EChartsOption {
  title?: any;
  tooltip?: any;
  legend?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  series: any[];
  color?: string[];
  backgroundColor?: string;
  textStyle?: any;
  [key: string]: any;
}

export class OptionBuilder {
  private option: EChartsOption = { series: [] };
  private theme: Theme;

  constructor(themeName = 'light') {
    this.theme = getTheme(themeName);
    this.applyTheme();
  }

  static create(themeName?: string): OptionBuilder {
    return new OptionBuilder(themeName);
  }

  title(text: string): this {
    this.option.title = {
      text,
      left: 'center',
      textStyle: { color: this.theme.textColor }
    };
    return this;
  }

  tooltip(trigger: 'item' | 'axis' = 'item'): this {
    this.option.tooltip = { trigger };
    return this;
  }

  legend(show = true): this {
    if (show) {
      this.option.legend = {
        bottom: 0,
        textStyle: { color: this.theme.textColor }
      };
    }
    return this;
  }

  grid(config: any): this {
    this.option.grid = config;
    return this;
  }

  xAxis(type: 'category' | 'value', data?: string[]): this {
    this.option.xAxis = {
      type,
      ...(data && { data }),
      axisLine: { lineStyle: { color: this.theme.axisLineColor } },
      axisLabel: { color: this.theme.textColor },
      splitLine: { lineStyle: { color: this.theme.splitLineColor } }
    };
    return this;
  }

  yAxis(type: 'category' | 'value', data?: string[]): this {
    this.option.yAxis = {
      type,
      ...(data && { data }),
      axisLine: { lineStyle: { color: this.theme.axisLineColor } },
      axisLabel: { color: this.theme.textColor },
      splitLine: { lineStyle: { color: this.theme.splitLineColor } }
    };
    return this;
  }

  series(seriesArray: any[]): this {
    this.option.series = seriesArray;
    return this;
  }

  merge(customOptions: any): this {
    this.option = this.deepMerge(this.option, customOptions);
    return this;
  }

  build(): EChartsOption {
    return this.option;
  }

  private applyTheme(): void {
    this.option.backgroundColor = this.theme.backgroundColor;
    this.option.color = this.theme.colorPalette;
    this.option.textStyle = { color: this.theme.textColor };
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}