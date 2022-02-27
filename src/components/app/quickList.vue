<template>
  <div class="quick-list" :data-grid="gridStyle">
    <quick-card :data="myFav" v-if="logged" />
    <quick-card :data="daily" type="daily" />
    <quick-card :data="radar" />
    <quick-card :data="randomPlayList" v-if="randomPlayList" />
    <f-m />
  </div>
</template>
<script>
import quickCard from '@components/app/quickCard';
import FM from '@components/app/FM';

import { getPlayList } from '@/api';
import { mapGetters } from 'vuex';
import { get } from 'vuex-pathify';
import { random } from 'lodash-es';
export default {
  name: 'QuickList',
  components: { FM, quickCard },
  props: {
    gridStyle: {
      type: String,
      default: 'A',
    },
  },
  data() {
    return {
      randomPlayList: {},
      radar: {},
      daily: {
        name: '今日推荐',
        picUrl:
          'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
      },
      album: {},
    };
  },
  async created() {
    const { playlist } = await getPlayList(3136952023);
    this.radar = {
      ...playlist,
      name: '私人雷达',
    };
    const filtersId = [3136952023, +this.myFav.id];
    const list = this.playlist.filter((i) => !filtersId.includes(i.id));
    this.randomPlayList = list[random(0, list.length)];
  },
  computed: {
    ...mapGetters({
      logged: 'settings/logged',
    }),
    playlist: get('music/playlist'),
    myFav() {
      const fav =
        this.$store.state.music.playlist.find((i) => i['specialType'] === 5) ??
        {};
      return {
        id: fav['id'],
        picUrl: fav['coverImgUrl'],
        name: '你喜欢的音乐',
      };
    },
  },
};
</script>
<style scoped lang="scss">
@mixin --columns($cols) {
  grid-template-columns: repeat($cols, 1fr);
}
.quick-list {
  display: grid;
  column-gap: 24px;
  row-gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 600px) {
    &[data-grid='A'] {
      @include --columns(1);
    }
  }
  @media (min-width: 601px) and (max-width: 960px) {
    &[data-grid='A'] {
      @include --columns(2);
    }
  }
  @media (min-width: 961px) and (max-width: 1264px) {
    &[data-grid='A'] {
      @include --columns(2);
    }
  }
  @media (min-width: 1265px) and (max-width: 1904px) {
    &[data-grid='A'] {
      @include --columns(3);
    }
  }
  @media screen and (min-width: 1905px) {
    &[data-grid='A'] {
      @include --columns(4);
    }
  }
  ::v-deep .cover-container {
    .v-responsive__content {
      // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
      width: inherit !important;
    }
  }
}
</style>
