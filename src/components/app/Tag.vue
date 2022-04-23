<template>
  <v-btn
    outlined
    text
    class="tag text-caption d-flex justify-start"
    :style="`border-left-color:${color}`"
    :data-name="name"
    :to="`/moods_and_genres/${name}`"
  >
    {{ name }}
  </v-btn>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    color: String,
    name: String,
  },
};
</script>

<style scoped lang="scss">
.tag {
  width: 100%;
  border-left: 6px solid;
}
.theme--dark .tag {
  background: var(--v-neumorphism-base);
}
</style>
