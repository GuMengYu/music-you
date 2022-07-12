<template>
  <v-text-field
    v-if="showInput"
    ref="searchInput"
    :model-value="keywords"
    color="primary"
    density="compact"
    :placeholder="$t('common.search_type_2')"
    :prepend-inner-icon="mdiMagnify"
    bg-color="surfaceVariant"
    :hide-details="true"
    variant="solo"
    :clearable="true"
    :single-line="true"
    class="search-input"
    autofocus
    @keydown.enter="handleSearch"
    @update:model-value="handleChange"
  >
  </v-text-field>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const keywords = ref('')
const searchInput = ref<ComponentPublicInstance>()

const showInput = computed(() => {
  return route.path.includes('/search')
})

watchEffect(() => {
  if (showInput.value) {
    keywords.value = (route.params.keywords as string) || ''
  }
})

function handleChange(text: string) {
  keywords.value = text
}
function handleSearch() {
  router.replace(`/search/${keywords.value}`)
}
</script>
<style lang="scss" scoped>
.search-input {
  flex: 0 1 256px;

  :deep(.v-field--variant-solo) {
    box-shadow: none;
    border-radius: 40px;
    padding-inline-end: 4px;

    .v-field__field {
      padding-top: 0px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .v-field__append-inner {
      padding-top: 0px;
      align-items: center;
    }
  }
}
</style>
