<template>
  <v-main>
    <v-container
      class="pa-4 pa-lg-6 pa-xl-8 pt-4"
      fluid
    >
        <router-view v-slot="{ Component }">
          <transition
              name="custom-classes-transition"
              enter-active-class="animate__animated animate__fadeIn"
          >
            <component :is="Component" />
          </transition>
        </router-view>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'DefaultView',
  setup() {

  },
};
</script>
