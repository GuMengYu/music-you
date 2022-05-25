<script lang="ts" setup>
import { mdiCrystalBall, mdiEmoticon } from '@mdi/js'
import { useToast } from 'vue-toastification'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { useTheme } from '@/hooks/useTheme'
const theme = useTheme()
const contextMenu = useContextMenu()
const toast = useToast()

const options = {
  items: [
    {
      label: 'with icon menu item',
      onClick: () => {
        toast.info('You click a menu item')
      },
      icon: mdiEmoticon,
    },
    {
      label: '菜单项 2',
      disabled: true,
      onClick: () => {
        alert('You click a menu item')
      },
      icon: mdiEmoticon,
    },
    {
      label: '带子菜单',
      icon: mdiCrystalBall,
      onClick: () => {
        alert('You click a menu item')
      },
      children: [
        {
          label: 'A submenu item 4',
          onClick: () => {
            toast.info('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 5',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 6',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
    {
      label: '带子菜单 4',
      icon: mdiCrystalBall,
      onClick: () => {
        alert('You click a menu item')
      },
      children: [
        {
          label: 'A submenu item 1',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 2',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 3',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
    {
      divided: true,
    },
    {
      label: 'Menu Item 5',
    },
  ],
  x: 0,
  y: 0,
  theme: theme.value,
}
function show(e: MouseEvent) {
  options.x = e.clientX
  options.y = e.clientY
  options.theme = theme.value
  contextMenu(options)
}
</script>

<template>
  <v-container>
    <v-card
      color="secondary"
      flat
      height="200"
      width="200"
      class="d-flex align-center justify-center"
      @contextmenu.prevent="show"
    >
      右键点击我
    </v-card>
  </v-container>
</template>
