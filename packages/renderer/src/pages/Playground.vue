<script lang="ts" setup>
import { mdiCrystalBall, mdiEmoticon } from '@mdi/js'
import { useToast } from 'vue-toastification'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { useTheme } from '@/hooks/useTheme'
const theme = useTheme()
const contextMenu = useContextMenu()
const toast = useToast()
</script>

<template>
  <v-container> </v-container>
</template>
