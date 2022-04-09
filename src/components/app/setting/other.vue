<template>
    <app-title path="common.other" class="mb-2 pl-1" />

    <v-list-item>
        <v-list-item-header>
            <v-list-item-title>{{ $t('common.language') }}</v-list-item-title>
        </v-list-item-header>
        <v-list-item-media>
            <App-Select v-model="locale" :items="localeOptions" />
        </v-list-item-media>
    </v-list-item>
    <v-list-item>
        <v-list-item-header>
            <v-list-item-title>{{ $t('common.quality') }}</v-list-item-title>
        </v-list-item-header>
        <v-list-item-media>
            <App-Select v-model="quality" :items="qualityOptions" />
        </v-list-item-media>
    </v-list-item>
    <v-divider class="mt-4 mb-3 mx-n3" />
</template>
<script setup>
import AppTitle from '../Title.vue'
import AppSelect from '@components/app/menu/Select.vue'
import { ref } from 'vue'

import { useSettingStore } from '@/store/setting';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localeOptions = [
    {
        title: t('common.zh'),
        value: 'zh',
        activeClass: 'text-primary',
        rounded: true,
    },
    {
        title: t('common.en'),
        value: 'en',
        activeClass: 'text-primary',
        rounded: true,

    },
]

const qualityOptions = [
    {
        title: '128kb',
        value: '128',
        activeClass: 'text-primary',
    },
    {
        title: '320kb',
        value: '320',
        activeClass: 'text-primary',
    },
]
const locale = ref('zh')
const quality = ref('320')
</script>