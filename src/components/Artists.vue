<template>
  <div class="d-flex flex-column align-center">
    <v-hover v-slot="{ hover }">
      <v-avatar color="indigo" size="120">
        <v-img :src="artists.img1v1Url | sizeOfImage" />
        <v-overlay
          :value="hover"
          absolute
        >
          <v-card-actions>
            <v-btn
              icon
              small
              elevation="0"
              class="play-btn"
              :class="{'hover-btn': hover}"
            >
              <v-icon>
                {{ mdiPlay }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-overlay>
      </v-avatar>
    </v-hover>
    <router-link
      :to="`/artist/${artists.id}`"
      class="title text--primary"
    >
      <span class="h-1x mt-2 text-body-2 font-weight-bold">{{ artists.name }}</span>
    </router-link>
  </div>
</template>

<script>
import {mdiPlay} from '@mdi/js';
export default {
  name: 'ArtistsCover',
  props: {
    artists: {
      type: Object,
      default: () => ({
        accountId: 511377589,
        albumSize: 64,
        alias: [],
        briefDesc: 'T-ara，别称“皇冠团”，拥有“韩国最百变女团”、“歌谣界的变色龙”等美誉，是M-net公司准备了三年时间的女子组合，于2009年7月29日出道，由全宝蓝、李居丽、朴素妍、咸恩静、朴孝敏、朴智妍六名散发不同魅力的成员组成。组合名称T-ara源自英文Tiara，意指将成为歌谣界的女王。T-ara以无限挑战的团队宗旨完美诠释了百变的无尽吸引力及超高风格驾驭力，如今不仅在歌谣界发光发热，更是在影视界、艺能界小有建树，是韩国极具代表性的偶像团体之一。主要代表作品有《Bo peep Bo peep》《Roly Poly》《Cry Cry》《lovey dovey》等。',
        followed: true,
        id: 127815,
        img1v1Id: 3419481180607870,
        img1v1Url: 'https://p2.music.126.net/ZfdxyAleCzBP6ZF2fXa23g==/3419481180607870.jpg',
        musicSize: 395,
        mvSize: 596,
        name: 'T-ara',
        picId: 109951163461905840,
        picId_str: '109951163461905843',
        picUrl: 'https://p2.music.126.net/XF28sfo0WEtsZqCsmJCmgg==/109951163461905843.jpg',
        publishTime: 1534390151246,
        topicPerson: 0,
        trans: '티아라',
      }),
    },
  },
  data: () => ({
    mdiPlay,
  }),
}
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
}
.hover-btn {
  backdrop-filter: blur(20px) brightness(96%);
  background: transparent;
}
.play-btn:hover {
  background: red;
}
</style>
