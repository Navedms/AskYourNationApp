export interface Colors {
  [key: string]: string;
}

const colors: Colors = {
  opacity: 'rgba(255, 255, 255, 0)',
  black: '#000',
  opacityBlack: 'rgba(0, 0, 0, 0.7)',
  white: '#fff',
  opacityWhite: 'rgba(255, 255, 255, 0.85)',
  primary: '#3366ff',
  secondary: '#0CD3B5',
  dark: '#5a5a5a',
  darkMedium: '#a6a6a6',
  medium: '#d9d9d9',
  light: '#f2f2f2',
  veryLight: '#FEFEFE',
  ok: '#53c68c',
  delete: '#ff3333',
  lightDelete: '#FF7D7D',
  yellow: '#ffff66',
  orange: '#FC9E03',
  disabled: '#F2DEDE',
  primaryBackground: '#B3C6FF',
  secondaryBackground: '#94D6CC',
  dangerBackground: '#FFB8B8',
  sensitiveBackground: '#FBBB5B',
  quietBackground: '#FFFF6F',
  lightGreenBackground: '#F1FFF1',
  lightOrangeBackground: '#FFF8F1',
  lightRedBackground: '#FFF1F1',
};

export default colors;
