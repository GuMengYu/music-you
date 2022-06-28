<template>
  <div>
    <app-title v-if="title" :path="title" class="mb-2" />

    <v-item-group
      class="mx-auto"
      mandatory
      :multiple="multiple"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <v-row :dense="true">
        <v-col v-for="{ icon, text, value } in items" :key="value ?? text" cols="4">
          <v-item :value="value ?? text">
            <template #default="{ isSelected, toggle }">
              <switch-card :title="t(text)" :model-value="isSelected" :icon="icon" @click="toggle" />
            </template>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

import AppTitle from '@/components/Title.vue'

export default {
  name: 'SettingsGroup',

  components: { AppTitle },
  props: {
    title: String,
    modelValue: null,
    items: Array,
    multiple: Boolean,
  },

  emits: {
    'update:modelValue': (value) => true,
  },

  setup() {
    const { t } = useI18n()
    const theme = useTheme()

    return {
      t,
      dark: computed(() => theme.current.value.dark),
    }
  },
}
</script>

<style lang="sass">
// Bug in Vuetify, ripple isn't inheriting border-radius
.v-card--group::before
  border-radius: inherit
</style>
