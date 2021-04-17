<template>
  <page :title="$t('main.new_releases_album')">
    <template>
      <cover-list :list="albums">
        <cover v-for="album in albums" :key="album.id" :data="album" />
      </cover-list>
    </template>
  </page>
</template>

<script>
import { newAlbums } from '@/api';
import CoverList from '@components/app/CoverList';
import Page from '@components/layout/Page';
import Cover from '../../components/app/Cover.vue';

export default {
  name: 'NewReleasesAlbums',
  components: {
    Page,
    CoverList,
    Cover,
  },
  props: {},
  data: () => ({
    loading: false,
    albums: [],
  }),
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const { albums } = await newAlbums({ area: 'ALL' });
      this.albums = albums;
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
