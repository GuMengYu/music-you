<template>
  <v-app class="v-player" :theme="theme">
    <app-header />
    <app-nav />
    <app-content class="v-player-content" />
    <app-footer />
    <app-setting />
    <!--
    <player-bar />
    <default-setting />
    <playing-page />
    <default-login />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" /> -->
  </v-app>
</template>

<script setup>
import AppNav from '@components/app/Navbar.vue';
import AppHeader from '@components/app/Header.vue';
import AppContent from '@components/layout/View.vue';
import AppSetting from '@components/app/setting/index.vue';
import AppFooter from '@components/app/Footer.vue';
import { computed, ref, onMounted } from 'vue'
import { useSettingStore } from "@/store/setting";
import { getPersonalized } from '@/api/index';
const theme = computed(() => {
  const { theme } = useSettingStore();
  return theme;
});


const result = ref(null)

onMounted(async () => {
  result.value = await getPersonalized()
})

</script>