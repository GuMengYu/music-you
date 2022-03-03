<template>
  <router-view v-slot="{ Component }">
    <v-fade-transition>
      <component :is="Component" />
    </v-fade-transition>
  </router-view>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
