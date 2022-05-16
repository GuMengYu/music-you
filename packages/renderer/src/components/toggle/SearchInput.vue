<template>
  <v-text-field
    v-show="showInput"
    :model-value="keywords"
    color="primary"
    density="compact"
    :placeholder="$t('common.search_type_2')"
    :prepend-inner-icon="mdiMagnify"
    bg-color="surfaceVariant"
    :hide-details="true"
    variant="outlined"
    class="search-input text-caption"
    :clearable="true"
    style="flex: 0 1 326px"
    @keydown.enter="handleSearch"
    @update:model-value="handleChange"
  >
  </v-text-field>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const keywords = ref('')

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
