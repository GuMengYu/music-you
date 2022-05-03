export default {
  methods: {
    goto(id) {
      this.$router.push(`/wallhaven/wallpaper/${id}`);
    },
  },
};
