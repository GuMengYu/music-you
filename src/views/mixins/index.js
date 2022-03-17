export default {
  computed: {
    coverWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return 128;
        case 'md':
        case 'lg':
          return 256;
        case 'xl':
          return 300;
        default:
          return 256;
      }
    },
  },
};
