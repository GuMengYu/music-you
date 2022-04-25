<template>
  <v-container class="pa-4">
    <div style="width: 200px">
      <Cover :data="cover" />
    </div>
    <track-item :track="track" from="list" />
  </v-container>
</template>

<script lang="ts">
import Cover from '../../components/app/cover/Cover.vue'
import TrackItem from '../../components/app/TrackItem.vue'
export default {
  components: { TrackItem, Cover },
  data: () => ({
    cover: {
      id: 12313,
      name: '封面名称',
      copywriter: '小编推荐',
      picUrl:
        'https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3264&q=80',
    },
    icons: ['mdi-rewind', 'mdi-play', 'mdi-fast-forward'],
    items: [
      {
        title: 'New Releases',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs. Updated daily.',
        img: 'https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3264&q=80',
      },
      {
        title: 'Rock',
        text: 'Greatest Rock Hits',
        subtext: 'Lose yourself in rock tunes.',
        img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
      },
      {
        title: 'Mellow Moods',
        text: 'Ambient Bass',
        subtext: 'Chill beats to mellow you out.',
        img: 'https://images.unsplash.com/photo-1542320868-f4d80389e1c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3750&q=80',
      },
    ],
    transparent: 'rgba(255, 255, 255, 0)',
    track: {
      name: '晚灯',
      id: 1860234947,
      pst: 0,
      t: 0,
      ar: [
        {
          id: 32673826,
          name: '刘森',
          tns: [],
          alias: [],
        },
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: '',
      fee: 8,
      v: 15,
      crbt: null,
      cf: '',
      al: {
        id: 130185746,
        name: '华北浪革',
        picUrl: 'https://p1.music.126.net/rDC1vd4RnngyLPmbjeffPg==/109951167261752746.jpg',
        tns: [],
        pic_str: '109951167261752746',
        pic: 109951167261752750,
      },
      dt: 183173,
      h: {
        br: 320000,
        fid: 0,
        size: 7329645,
        vd: -21587,
        sr: 48000,
      },
      m: {
        br: 192000,
        fid: 0,
        size: 4397805,
        vd: -18947,
        sr: 48000,
      },
      l: {
        br: 128000,
        fid: 0,
        size: 2931885,
        vd: -17162,
        sr: 48000,
      },
      sq: {
        br: 702799,
        fid: 0,
        size: 16091773,
        vd: -21739,
        sr: 48000,
      },
      hr: {
        br: 1461516,
        fid: 0,
        size: 33463853,
        vd: -21586,
        sr: 48000,
      },
      a: null,
      cd: '01',
      no: 3,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 0,
      s_id: 0,
      mark: 536870912,
      originCoverType: 1,
      originSongSimpleData: null,
      tagPicList: null,
      resourceState: true,
      version: 15,
      songJumpInfo: null,
      entertainmentTags: null,
      single: 0,
      noCopyrightRcmd: null,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 0,
      mv: 0,
      publishTime: 1625932800000,
    },
  }),
}
</script>
