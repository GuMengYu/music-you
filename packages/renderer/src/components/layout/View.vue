<template>
  <v-main class="pb-16">
    <v-container class="pa-6 pt-2" fluid>
      <router-view v-slot="{ Component }">
        <transition v-if="$route.meta['keepAlive']" name="route-animation">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
        <transition v-else name="route-animation">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>
