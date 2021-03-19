<template>
  <page title="电台"> </page>
</template>

<script>
import { getUserAudio } from '@/api/user';
import { mapGetters } from 'vuex';
import Page from '@components/layout/Page';
export default {
  name: 'DJ',
  components: { Page },
  data: () => ({
    radios: [],
  }),
  computed: {
    ...mapGetters({
      uid: 'settings/userId',
    }),
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const { djRadios } = await getUserAudio();
      this.radios = djRadios;
    },
  },
};
</script>

<style scoped></style>
