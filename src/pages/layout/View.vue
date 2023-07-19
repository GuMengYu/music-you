<template>
  <v-main class="overflow-y-auto h-100">
    <v-container class="pa-4 pt-5 pb-7 drag-area" fluid>
      <router-view v-slot="{ Component }">
        <transition v-if="$route.meta['keepAlive']" name="route-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" class="no-drag-area" />
          </keep-alive>
        </transition>
        <transition v-else name="route-animation" mode="out-in">
          <component :is="Component" class="no-drag-area" />
        </transition>
      </router-view>
    </v-container>
    <back-to-top />
  </v-main>
</template>
