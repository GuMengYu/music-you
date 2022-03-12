<template>
  <div>
    <v-btn @click="show"> show toast </v-btn>
    <store-card :presence="presence" />
    <v-list>
      <track-item :track="song" />
      <track-item :track="song" />
    </v-list>
  </div>
</template>

<script>
import StoreCard from '@components/app/StoreCard';
import { generatePaletteFromURL } from 'md3-theme-generator';
import TrackItem from '@components/app/TrackItem';
export default {
  name: 'Index',
  components: { TrackItem, StoreCard },
  data: () => ({
    data: {},
    song: {
      name: '二零三',
      id: 1407214788,
      pst: 0,
      t: 0,
      ar: [
        {
          id: 12138269,
          name: '毛不易',
          tns: [],
          alias: [],
        },
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: '',
      fee: 8,
      v: 11,
      crbt: null,
      cf: '',
      al: {
        id: 83823905,
        name: '小王',
        picUrl:
          'http://p4.music.126.net/XPPeIZu7wgcGXZ0666mfFg==/109951164640697307.jpg',
        tns: [],
        pic_str: '109951164640697307',
        pic: 109951164640697310,
      },
      dt: 226609,
      h: {
        br: 320000,
        fid: 0,
        size: 9066623,
        vd: -36160,
      },
      m: {
        br: 192000,
        fid: 0,
        size: 5439991,
        vd: -33518,
      },
      l: {
        br: 128000,
        fid: 0,
        size: 3626675,
        vd: -31741,
      },
      a: null,
      cd: '01',
      no: 1,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 0,
      s_id: 0,
      mark: 8192,
      originCoverType: 1,
      originSongSimpleData: null,
      resourceState: true,
      version: 11,
      single: 0,
      noCopyrightRcmd: null,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 1416574,
      mv: 10905772,
      publishTime: 0,
      privilege: {
        id: 1407214788,
        fee: 8,
        payed: 1,
        st: 0,
        pl: 999000,
        dl: 999000,
        sp: 7,
        cp: 1,
        subp: 1,
        cs: false,
        maxbr: 999000,
        fl: 128000,
        toast: false,
        flag: 4,
        preSell: false,
        playMaxbr: 999000,
        downloadMaxbr: 999000,
        rscl: null,
        freeTrialPrivilege: {
          resConsumable: false,
          userConsumable: false,
        },
        chargeInfoList: [
          {
            rate: 128000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 0,
          },
          {
            rate: 192000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1,
          },
          {
            rate: 320000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1,
          },
          {
            rate: 999000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1,
          },
        ],
      },
    },
    presence: {
      title: 'YouTuBe',
      cover: 'https://i.imgur.com/OAcBmwW.png',
      color: 'rgb(225, 48, 108)',
      description: '简介 你猜是什么的哦屋顶萨瓦河 ',
      artist: {
        id: '234',
        name: 'justin',
      },
    },
  }),
  async created() {
    const result = await generatePaletteFromURL(
      'https://i.imgur.com/OAcBmwW.png',
    );
    this.presence.color = result.primaryGroup?.luminance40;
  },
  methods: {
    show() {
      this.$toast('Default toast', { timeout: -1 });
    },
  },
};
</script>

<style scoped></style>
