<script setup lang="ts">
import { mdiRestore } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import AppTitle from '@/components/Title.vue'
const { t } = useI18n({ useScope: 'global' })
const showAlert = ref(false)
function resetApp() {
  showAlert.value = false
  window.localStorage.clear()
  window.location.reload()
}
</script>
<template>
  <div>
    <app-title path="message.reset_app" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.reset') }}</v-list-item-title>
      <template #append>
        <v-dialog v-model="showAlert" persistent>
          <template #activator="{ props }">
            <v-btn color="primary" v-bind="props" variant="tonal">
              {{ t('message.reset_app') }}
            </v-btn>
          </template>
          <v-card class="pa-3 align-self-center" rounded="xl" color="surface" width="90vw" max-width="350">
            <div class="d-flex justify-center">
              <v-icon color="secondary">
                {{ mdiRestore }}
              </v-icon>
            </div>
            <v-card-title class="text-center">{{ t('message.reset_app') }}</v-card-title>
            <span class="px-6 text-center text-caption">{{ t('message.reset_msg') }}</span>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" variant="text" rounded="pill" @click="resetApp"> {{ t('common.agree') }} </v-btn>
              <v-btn color="primary" variant="flat" rounded="pill" @click="showAlert = false">
                {{ t('common.disagree') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-list-item>
  </div>
</template>
