<template>
  <div>
    <v-btn @click="show"> show toast </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data: () => ({
    data: {},
  }),
  methods: {
    show() {
      this.$toast('Default toast', { timeout: -1 });
    },
  },
};
</script>

<style scoped></style>
