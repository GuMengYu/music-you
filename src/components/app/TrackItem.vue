<template>
  <v-hover v-slot="{ hover }">
    <div
      v-ripple
      @dblclick="play"
      @contextmenu.prevent="openMenu"
      class="track-item-wrapper rounded px-2"
      :class="{ unavailable: !available.enable }"
      :style="gridTemplate"
      :title="available.enable ? '' : available.text"
    >
      <div class="track-index">
        <span class="track-count" v-show="!hover">{{ index }}</span>
        <v-btn icon @click.stop="play" v-show="hover">
          <v-icon v-text="mdiPlay" />
        </v-btn>
      </div>
      <div class="track-first">
        <v-img
          v-if="from !== 'album'"
          :src="$ochain(album, 'picUrl') | sizeOfImage(64)"
          max-height="40"
          max-width="40"
          class="rounded track-cover"
          lazy-src="@assets/placeholder.png"
        />
        <div class="track-info">
          <v-list-item-title v-text="track.name" class="h-1x" />
          <v-list-item-subtitle>
            <artists-link :artists="artists" class="h-1x" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div class="track-second" v-if="from !== 'album'">
        <router-link
          :to="`/album/${album.id}`"
          class="text-subtitle-2 onSurface--text h-2x"
        >
          {{ album.name }}
        </router-link>
      </div>
      <div class="track-third">
        <v-btn
          icon
          v-visible="liked || hover"
          @click.prevent="toggleLike"
          :loading="likeLoading"
        >
          <v-icon
            small
            v-text="liked ? mdiHeart : mdiHeartOutline"
            :color="liked ? 'primary' : ''"
          />
        </v-btn>
        <!--        <like-toggle :id="track.id" />-->
        <div class="track-duration">
          {{ track.dt || track.duration | formatDuring }}
        </div>
        <v-btn v-visible="hover" icon color="primary" @click.prevent="openMenu">
          <v-icon small>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-hover>
</template>
<script>
import { mdiDotsHorizontal, mdiPlay, mdiHeart, mdiHeartOutline } from '@mdi/js';
import { dispatch, get, commit } from 'vuex-pathify';
import ArtistsLink from '@components/app/ArtistsLink';
import { doPlaylist } from '@api/music';

export default {
  name: 'TrackItem',
  components: { ArtistsLink },
  props: {
    track: {
      type: Object,
      default: () => ({}),
    },
    from: {
      type: String,
      default: 'album',
    },
    index: {
      type: [String, Number],
      default: 0,
    },
    own: {
      type: Boolean,
      default: false,
    },
    pid: [String, Number],
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiPlay,
    mdiHeart,
    mdiHeartOutline,
    likeLoading: false,
  }),
  computed: {
    liked() {
      return this.$store.getters['music/liked'](this.track.id);
    },
    current: get('music/track@id'),
    active() {
      return this.track.id === this.current;
    },
    menuItems() {
      const metadata = {
        id: this.track.id,
        type: 'track',
        fileName: `${this.track.name}`,
      };
      const items = [
        { title: '加入播放列表', action: 'play', metadata },
        {
          title: '转至艺人',
          action: 'goto',
          metadata: { type: 'artist', id: this.artists[0]?.id },
        },
        {
          title: '转至专辑',
          action: 'goto',
          metadata: { type: 'album', id: this.album?.id },
        },
        {
          title: '收藏到歌单',
          metadata: {
            cb: () => {
              commit('app/addToPlayList', this.track.id);
            },
          },
        },
        { title: '下载到本地', action: 'download', metadata },
      ];
      if (this.liked) {
        items.push({ title: '从"喜欢的音乐"移除', action: 'sub', metadata });
      } else {
        items.push({ title: '添加到"喜欢的音乐"', action: 'sub', metadata });
      }
      if (this.own) {
        items.push({
          title: '从此歌单删除',
          action: 'sub',
          metadata: {
            cb: async () => {
              await doPlaylist('del', this.pid, [this.track.id]);
              this.$emit('reload');
            },
          },
        });
      }
      return items;
    },
    artists() {
      const { ar, artists } = this.track;
      const art = ar ?? artists ?? [];
      return art.map((i) => ({ id: i.id, name: i.name }));
    },
    album() {
      const { al, album } = this.track;
      return al ?? album;
    },
    gridTemplate() {
      if (this.from !== 'album') {
        return {
          gridTemplateColumns:
            '[index] 36px [first] 3fr [second] 2fr [last] minmax(100px, 1fr)',
        };
      } else {
        return {
          gridTemplateColumns:
            '[index] 36px [first] 4fr [last] minmax(100px, 1fr)',
        };
      }
    },
    logged: (vm) => vm.$store.getters['settings/logged'],
    isVip() {
      return (
        this.$store.state.settings.account?.profile?.vipType === 11 ?? false
      );
    },
    available() {
      if (this.track.fee === 1) {
        if (this.logged && this.isVip) {
          return {
            enable: true,
          };
        } else {
          return {
            enable: false,
            text: 'VIP用户可用',
          };
        }
      } else if (this.track.fee === 4) {
        return {
          text: '付费专辑，先购买',
          enable: false,
        };
      } else if (this.track.noCopyrightRcmd) {
        return {
          text: '无版权',
          enable: false,
        };
      } else {
        return {
          enable: true,
        };
      }
    },
  },
  methods: {
    play() {
      if (this.track?.id) {
        this.$player.updatePlayerTrack(this.track?.id);
        this.$emit('played', this.track.id);
      }
    },
    async toggleLike() {
      this.likeLoading = true;
      const before = this.liked;

      const success = await dispatch('music/favSong', {
        id: this.track.id,
        like: !this.liked,
      });
      if (success) {
        if (before) {
          this.$toast('已从"喜欢的音乐"移除');
        } else {
          this.$toast('已添加至"喜欢的音乐"');
        }
      } else {
        this.$toast('操作频繁或者网络出现错误');
      }
      this.likeLoading = false;
    },
    more() {},
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>
<style scoped lang="scss">
.track-item-wrapper {
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: 56px;
  cursor: pointer;
  &:hover {
    background-color: var(--v-surfaceVariant-base);
  }
  .track-index {
    .track-count {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .track-first {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .track-second {
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .track-third {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: flex-end;
  }
}
.unavailable {
  cursor: initial;
  .track-cover {
    filter: opacity(0.6) grayscale(1);
  }
  .track-index,
  .track-info,
  .track-second,
  .track-third {
    opacity: 0.6;
  }
}
</style>
