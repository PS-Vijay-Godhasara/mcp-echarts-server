export interface ThemeColors {
  primary: string[];
  background: string;
  text: string;
  grid: string;
  axis: string;
}

export const themes: Record<'light' | 'dark', ThemeColors> = {
  light: {
    primary: [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff9f7f'
    ],
    background: '#ffffff',
    text: '#333333',
    grid: '#f0f0f0',
    axis: '#cccccc'
  },
  dark: {
    primary: [
      '#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9',
      '#05c091', '#ff8a45', '#8d48e3', '#dd79ff', '#ffb347'
    ],
    background: '#1a1a1a',
    text: '#ffffff',
    grid: '#333333',
    axis: '#666666'
  }
};

export function getThemeColors(theme: 'light' | 'dark' = 'light'): ThemeColors {
  return themes[theme];
}

export function createGradient(color: string, theme: 'light' | 'dark' = 'light') {
  const opacity = theme === 'dark' ? 0.3 : 0.2;
  return {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color },
      { offset: 1, color: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` }
    ]
  };
}