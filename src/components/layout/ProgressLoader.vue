<template>
  <v-progress-linear
    value="15"
    :active="loading"
    absolute
    top
  ></v-progress-linear>
</template>

<script>
import {get} from 'vuex-pathify';
export default {
  name: 'ProgressLoader',
  computed: {
    loading: get('app/loading'),
  },
}
</script>

<style scoped>

</style>
