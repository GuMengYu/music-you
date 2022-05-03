<template>
  <section>
    <div class="mb-4">
      <div class="text-caption grey--text text--lighten-1" v-if="subtitle">
        {{ subtitle }}
      </div>
      <div class="d-flex justify-space-between">
        <h1
          class="onSurface--text font-weight-bold"
          :class="hClass || 'text-h6'"
        >
          {{ title }}
        </h1>
        <v-btn v-if="more" text plain small class="font-weight-bold" :to="more">
          {{ $t('common.more') }}
        </v-btn>
      </div>
    </div>
    <slot />
    <slot name="action" />
  </section>
</template>

<script>
export default {
  name: 'CustomCol',
  props: {
    title: String,
    subtitle: String,
    hClass: String,
    more: [String, Function],
  },
};
</script>
