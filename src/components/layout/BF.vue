<template>
  <div>
    <v-btn
      small
      icon
      @click="$router.go(-1)"
    >
      <v-icon>
        {{ mdiChevronLeft }}
      </v-icon>
    </v-btn>
    <v-btn
      small
      icon
      @click="$router.go(1)"
    >
      <v-icon>
        {{ mdiChevronRight }}
      </v-icon>
    </v-btn>
    <reload-btn />
  </div>
</template>

<script>
import {mdiChevronRight, mdiChevronLeft} from '@mdi/js';
import ReloadBtn from '@components/layout/ReloadBtn'
export default {
  name: 'BF',
  components: { ReloadBtn },
  data:() => ({mdiChevronRight, mdiChevronLeft}),
}
</script>
