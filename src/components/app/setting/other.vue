<template>
    <app-title path="common.other" class="mb-2 pl-1" />

    <v-list-item>
        <v-list-item-header>
            <v-list-item-title>{{ $t('common.language') }}</v-list-item-title>
        </v-list-item-header>
        <v-list-item-media>
            <App-Menu v-model="locale" :options="localeOptions" subHeader="common.translations" />
        </v-list-item-media>
    </v-list-item>
    <v-list-item>
        <v-list-item-header>
            <v-list-item-title>{{ $t('common.quality') }}</v-list-item-title>
        </v-list-item-header>
        <v-list-item-media>
            <App-Menu v-model="quality" :options="qualityOptions" subHeader="common.translations" />
        </v-list-item-media>
    </v-list-item>
    <v-divider class="mt-4 mb-3 mx-n3" />
</template>
<script setup>
import AppTitle from '../Title.vue'
import AppMenu from '@components/app/menu/Menu.vue'
import { ref } from 'vue'

import { useSettingStore } from '@/store/setting';
const localeOptions = [
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

const qualityOptions = [
    {
        title: '128kb',
        value: '128',
    },
    {
        title: '320kb',
        value: '320',
    },
]
const locale = ref('zh')
const quality = ref('320')
</script>