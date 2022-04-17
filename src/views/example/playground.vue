<template>
    <span>{{ messages }}</span>
</template>

<script setup>
import { inject } from 'vue'

const messages = inject('messages')


</script>