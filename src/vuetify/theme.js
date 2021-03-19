const infoColor = {
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
};
export default {
  vuetify: {
    name: 'vuetify',
    palette: {
      // 所有的键将生成主题样式,
      // 这里我们添加一个自定义的 `tertiary` 颜色
      // tertiary: colors.pink.base,
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#82B1FF',
      ...infoColor,
    },
  },
  tomato: {
    name: 'tomato',
    palette: {
      primary: '#F14843',
      secondary: '#FFC49E',
      accent: '#FFC49E',
      ...infoColor,
    },
  },
  sea: {
    name: 'sea',
    palette: {
      primary: '#5668FF',
      secondary: '#7C73FE',
      accent: '#FEFFFE',
      ...infoColor,
    },
  },
  begonia: {
    name: 'begonia',
    palette: {
      primary: '#D2AAB2',
      secondary: '#D1919F',
      accent: '#C83E3E',
      ...infoColor,
    },
  },
  radio: {
    name: 'radio',
    palette: {
      primary: '#E50914',
      secondary: '#3D4A5B',
      accent: '#C22C38',
      ...infoColor,
    },
  },
  square: {
    name: 'square',
    palette: {
      primary: '#0A0662',
      secondary: '#891460',
      accent: '#6D638D',
      ...infoColor,
    },
  },
};
