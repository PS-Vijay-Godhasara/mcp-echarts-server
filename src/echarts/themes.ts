export interface Theme {
  backgroundColor: string;
  textColor: string;
  axisLineColor: string;
  splitLineColor: string;
  colorPalette: string[];
}

export const themes: Record<string, Theme> = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    axisLineColor: '#cccccc',
    splitLineColor: '#f0f0f0',
    colorPalette: [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ]
  },
  dark: {
    backgroundColor: '#1e1e1e',
    textColor: '#ffffff',
    axisLineColor: '#555555',
    splitLineColor: '#333333',
    colorPalette: [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ]
  }
};

export function getTheme(name: string): Theme {
  return themes[name] || themes.light;
}