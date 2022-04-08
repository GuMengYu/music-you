<template>
    <App-Menu v-model="model" :options="options" subHeader="common.translations" />
</template>

<script setup>
import { ref } from 'vue'
import AppMenu from '@components/app/menu/Menu.vue'

const options = [
    {
        title: 'common.zh',
        icon: 'mdi-home',
        value: 'zh',
    },
    {
        title: 'common.en',
        icon: 'mdi-playlist-play',
        value: 'en',
    },
]
const model = ref('home')

</script>