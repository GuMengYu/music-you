<template>
  <v-text-field
    ref="searchInput"
    v-click-outside="handleClickOutside"
    :model-value="keywords"
    density="compact"
    :placeholder="$t('common.search_type_2')"
    :prepend-inner-icon="mdiMagnify"
    :hide-details="true"
    variant="solo"
    :clearable="true"
    class="search-input"
    @keydown.enter="handleSearch"
    @update:model-value="handleChange"
  >
  </v-text-field>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import type { VTextField } from 'vuetify/components'

import { useAppStore } from '@/store/app'

const router = useRouter()
const route = useRoute()
const keywords = ref('')
const display = useDisplay()
const { smAndUp } = display
const searchInput = ref<InstanceType<typeof VTextField>>()
const { showSearch } = storeToRefs(useAppStore())

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
function handleClickOutside() {
  if (showSearch.value) {
    showSearch.value = false
  }
}
</script>
<style lang="scss" scoped>
.search-input {
  max-width: 256px;
  :deep(.v-field--variant-solo) {
    // box-shadow: none;
    border-radius: 8px;
    // padding-inline-end: 2px;

    .v-field__input {
      // padding-top: 0px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .v-field__append-inner {
      // padding-top: 0px;
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
