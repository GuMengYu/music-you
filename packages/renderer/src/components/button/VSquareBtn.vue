<template>
  <v-btn
    variant="outlined"
    :style="{
      minWidth: 'calc(var(--v-btn-height))',
      padding: 0,
    }"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>
