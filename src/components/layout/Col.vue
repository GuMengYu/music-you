<template>
  <section>
    <div class="mb-3">
      <div v-if="props.subtitle" class="text-caption text-grey-lighten-1">
        {{ props.subtitle }}
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="onSurface--text" :class="props.hClass || 'text-h6'">
          {{ props.title }}
        </div>
        <v-btn v-if="props.more" variant="plain" size="small" @click="handleMore">
          {{ $t('common.more') }}
        </v-btn>
        <slot name="more" />
      </div>
    </div>
    <slot />
    <slot name="action" />
  </section>
</template>
<script setup lang="ts">
import { isFunction } from 'lodash-es'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
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
const handleMore = () => {
  if (isFunction(props.more)) {
    props.more()
  } else {
    router.push(props.more)
  }
}
</script>
