<template>
  <div>
    <v-btn
      small
      icon
      @click="$router.go(-1)"
    >
      <v-icon small>
        {{ mdiChevronLeft }}
      </v-icon>
    </v-btn>
    <v-btn
      small
      icon
      @click="$router.go(1)"
    >
      <v-icon small>
        {{ mdiChevronRight }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import {mdiChevronRight, mdiChevronLeft} from '@mdi/js';
export default {
  name: 'BF',
  data:() => ({mdiChevronRight, mdiChevronLeft}),
}
</script>
