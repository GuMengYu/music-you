<script lang="ts" setup>
import type { Scheme, Theme } from '@material/material-color-utilities'
import { hexFromArgb, themeFromImage } from '@material/material-color-utilities'

const image = new Image()
image.src = 'https://material-foundation.github.io/material-theme-builder/assets/1_wallpaper.webp'
image.crossOrigin = 'anonymous'

themeFromImage(image).then((theme) => {
  console.log(theme)
  console.log(generateVuetifyTheme(theme, 'Customer'))
})

function generateVuetifyTheme(theme: Theme, name: string) {
  const toHex = (scheme: Scheme) => {
    let map: Record<string, string> = {}
    for (const [key, value] of Object.entries(scheme.toJSON())) {
      map[key] = hexFromArgb(value)
    }
    return map
  }
  const light = {
    name: `${name}Light`,
    dark: false,
    colors: toHex(theme.schemes.light),
  }
  const dark = {
    name: `${name}Dark`,
    dark: true,
    colors: toHex(theme.schemes.light),
  }
  return {
    [light.name]: light,
    [dark.name]: dark,
  }
}
</script>

<template>
  <v-container> </v-container>
</template>
