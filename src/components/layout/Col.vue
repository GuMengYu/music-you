<template>
  <v-sheet>
    <div class="title mb-5">
      <div class="text-caption grey--text text--lighten-1 font-weight-bold">
        {{ subtitle }}
      </div>
      <div class="d-flex justify-space-between">
        <div class="text-h6 font-weight-bold">
          {{ title }}
        </div>
        <v-btn v-if="more" text plain small class="font-weight-bold" :to="more">
          {{ $t('common.more') }}
        </v-btn>
      </div>
    </div>
    <slot name="content" />
  </v-sheet>
</template>

<script>
export default {
  name: 'CustomCol',
  props: {
    title: String,
    subtitle: String,
    more: String,
  },
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  height: 52px;
}
</style>
