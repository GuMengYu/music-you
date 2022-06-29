<template>
  <v-btn
    variant="outlined"
    :style="{
      minWidth: 'var(--v-btn-height)',
      padding: 0,
    }"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>
