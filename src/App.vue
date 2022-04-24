<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
