<template>
  <div>
    <div class="title mb-4">
      <div class="text-caption grey--text text--lighten-1" v-if="subtitle">
        {{ subtitle }}
      </div>
      <div class="d-flex justify-space-between">
        <div class="text-h6 onSurfaceVariant--text">
          {{ title }}
        </div>
        <v-btn v-if="more" text plain small class="font-weight-bold" :to="more">
          {{ $t('common.more') }}
        </v-btn>
      </div>
    </div>
    <slot />
  </div>
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
