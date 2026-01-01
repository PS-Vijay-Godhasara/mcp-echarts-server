# Chart Testing Guide

## Usage

Test individual charts or all charts with theme support:

```bash
# Test specific chart (default light theme)
npm run test:charts -- line
npm run test:charts -- bar
npm run test:charts -- pie

# Test with dark theme
npm run test:charts -- line --theme=dark
npm run test:charts -- bar --theme=dark

# Test all charts (light theme)
npm run test:charts -- --all

# Test all charts (dark theme)
npm run test:charts -- --all --theme=dark
```

**Note**: The `--` is required to separate npm arguments from script arguments.

## Supported Chart Types

Run `npm run test:charts -- --all` to see all 16 supported chart types:
- line, bar, pie, scatter, effectScatter
- radar, heatmap, boxplot, candlestick, parallel
- funnel, gauge, tree, treemap, sunburst
- graph, calendar

## Output

Charts are saved as SVG files:
- `test-{chartType}-{theme}.svg`
- Example: `test-line-light.svg`, `test-bar-dark.svg`

## Themes

- **Light Theme**: Professional blue-green palette with clean backgrounds
- **Dark Theme**: Vibrant colors optimized for dark backgrounds