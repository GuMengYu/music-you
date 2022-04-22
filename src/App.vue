<template>
  <router-view v-slot="{ Component }">
    <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn">
      <component :is="Component" />
    </transition>
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
