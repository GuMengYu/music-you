export default {
  beforeCreate() {
    const options = this.$options;
    if (options.player) {
      this.$player = options.player;
    } else {
      this.$player = (options.parent && options.parent.$player) || this;
    }
  },
};
