<template>
  <section>
    <h6 class="text-h5 mb-4">setting</h6>
    <app-settings-theme />

    <v-divider class="mt-4 mb-3 mx-n3" />

    <app-settings-other />
    <v-dialog v-model="showAlert" persistent>
      <template #activator="{ props }">
        <v-btn color="primary" v-bind="props"> {{ $t('message.reset_app') }} </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5"> {{ $t('message.reset_app') }} </v-card-title>
        <v-card-text>{{ $t('message.reset_msg') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="showAlert = false">
            {{ $t('common.disagree') }}
          </v-btn>
          <v-btn color="primary darken-1" variant="text" @click="resetApp"> {{ $t('common.agree') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import AppSettingsOther from './components/Other.vue'
import AppSettingsTheme from './components/Theme.vue'
const showAlert = ref(false)
function resetApp() {
  showAlert.value = false
  window.localStorage.clear()
  window.location.reload()
}
</script>
