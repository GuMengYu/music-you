<template>
  <v-hover v-slot="{ hover }">
    <v-list-item
      :value="song.id"
      :data-id="song.id"
      @click="noop"
    >
      <v-card
        class="mr-4"
      >
        <v-overlay
          :value="hover"
          absolute
        >
          <v-btn
            icon
            @click="play"
          >
            <font-awesome-icon icon="play" />
          </v-btn>
        </v-overlay>
        <v-img
          :src="$$(song, 'al', 'picUrl')| sizeOfImage(128)"
          max-height="40"
          max-width="40"
          class="rounded"
          lazy-src="@/assets/default-cover.png"
        />
      </v-card>
      <v-list-item-content>
        <v-list-item-title
          class="font-weight-bold"
          v-text="song.name"
        />
        <v-list-item-subtitle
          class="font-weight-bold"
          v-text="$$(song, 'ar', '0', 'name')"
        />
      </v-list-item-content>
      <v-list-item-action class="d-flex flex-row align-center song-btns">
        <v-btn
          v-show="hover"
          width="30"
          height="30"
          icon
          color="red"
          x-small
          class="list-delete-button"
          @click.stop="more"
        >
          <v-icon>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
        <v-list-item-action-text v-show="!hover">
          {{ song.dt | formatDuring }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>
<script>
import {mdiHeart, mdiDotsHorizontal, mdiHeartOutline, mdiPlay} from '@mdi/js';
import {dispatch} from 'vuex-pathify';

export default {
  name: 'SongBar',
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () =>({
    mdiDotsHorizontal,
    mdiHeart,
    mdiHeartOutline,
    mdiPlay,
  }),
  computed: {
    playing() {
      return true;
    },
  },
  methods: {
    play() {
      dispatch('music/updateTrack', this.song.id);
      this.$emit('played', this.song.id);
      // this.$store.dispatch('music/startNewMusic', this.song.id);
    },
    more() {

    },
    noop() {},
  },
}
</script>
