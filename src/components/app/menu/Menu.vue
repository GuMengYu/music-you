<template>
    <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" class="text-lowercase font-weight-bold">
                {{ text }}
                <v-icon right class="ml-0" size="14">{{ mdiChevronDown }}</v-icon>
            </v-btn>
        </template>
        <v-sheet>
            <!-- <app-title v-if="props.subHeader" :path="props.subHeader" class="mt-2 ml-1" /> -->
            <app-list
                nav
                :items="props.options"
            />
        </v-sheet>
    </v-menu>
</template>
<script setup>
import AppTitle from '@components/app/Title.vue'
import AppList from '@components/app/list/List.vue'
import { mdiChevronDown } from '@mdi/js';

import { defineProps, computed } from 'vue'
const props = defineProps({
    modelValue: [String, Number],
    options: {
        type: Array,
        default: () => [],
    },
    subHeader: String,
})

const model = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const text = computed(() => {
    const o = props.options.find(o => o.val === model.value)
    return o ? o.title : 'select'
})

</script>
