<template>
  <section>
    <div class="mb-4">
      <div class="text-caption text-grey-lighten-1" v-if="props.subtitle">
        {{ props.subtitle }}
      </div>
      <div class="d-flex justify-space-between">
        <div
          class="onSurface--text"
          :class="props.hClass || 'text-h6'"
        >
          {{ props.title }}
        </div>
        <v-btn v-if="props.more" text plain small class="font-weight-bold" :to="props.more">
          {{ $t('common.more') }}
        </v-btn>
      </div>
    </div>
    <slot />
    <slot name="action" />
  </section>
</template>
<script setup lang="ts">

const props = defineProps(  {
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  more: {
    type: [String, Function],
    default: '',
  },
  hClass: {
    type: String,
    default: '',
  },
})

</script>
