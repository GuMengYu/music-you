<template>
  <v-btn
    variant="outlined"
    :style="{
      minWidth: 'calc(var(--v-btn-height) + 4px)',
      padding: 0,
    }"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>
