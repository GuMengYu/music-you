<template>
  <v-main>
    <v-fade-transition hide-on-leave="">
      <v-container class="pa-4 pa-sm-6 pa-md-8">
        <router-view :key="$route.path" />
      </v-container>
    </v-fade-transition>
  </v-main>
</template>

<script>
export default {
  name: 'DefaultView',
}
</script>
