<template>
  <div>
    <v-btn @click="show"> show toast </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    show() {
      this.$message({
        message: 'haodea',
      });
    },
  },
};
</script>

<style scoped></style>
