<template>
  <v-text-field
    ref="searchInput"
    :model-value="keywords"
    color="primary"
    density="comfortable"
    :placeholder="$t('common.search_type_2')"
    :prepend-inner-icon="mdiMagnify"
    bg-color="surfaceVariant"
    :hide-details="true"
    variant="solo"
    :clearable="true"
    :single-line="true"
    class="search-input"
    @keydown.enter="handleSearch"
    @update:model-value="handleChange"
  >
    <template v-if="smAndUp" #append>
      <account />
    </template>
    <template v-else #append-inner>
      <account />
    </template>
  </v-text-field>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const router = useRouter()
const route = useRoute()
const keywords = ref('')
const display = useDisplay()
const { smAndUp } = display
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
  router.push(`/search/${keywords.value}`)
}
</script>
<style lang="scss" scoped>
.search-input {
  max-width: 390px;
  :deep(.v-field--variant-solo) {
    box-shadow: none;
    border-radius: 48px;
    padding-inline-end: 6px;

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
  :deep(.v-input__append) {
    padding-top: 0px;
    align-items: center;
    margin-inline-start: 8px;
  }
}
</style>
