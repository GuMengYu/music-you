<template>
  <v-progress-circular
    v-if="progress > 0"
    :value="progress"
    size="20"
    width="2"
  />
</template>

<script>
import { get } from 'vuex-pathify';
export default {
  name: 'DownloadProgress',
  computed: {
    progress: get('app/downloadprogress'),
  },
};
</script>
