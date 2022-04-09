<template>
    <v-menu>
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }" />
        </template>
        <v-sheet>
            <app-list
                v-model="selected"
                nav
                :items="props.items"
            />
        </v-sheet>
    </v-menu>
</template>
<script setup>
import AppList from '@components/app/list/List.vue'

import { defineProps, computed } from 'vue'
const props = defineProps({
    modelValue: [String, Number],
    items: {
        type: Array,
        default: () => [],
    },
})

const selected = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})


</script>
