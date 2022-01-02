import queryString from 'querystring';
import songs from '@/mock/music/songs.json';
import lrcs from '@/mock/music/lrc.json';
const musicDetail = ({ url }) => {
  const { ids } = queryString.parse(url.split('?')[1]);
  const _ids = ids?.split().map((id) => +id);
  const result = songs.filter((song) => _ids.includes(song.id));
  return {
    songs: result,
    code: 200,
  };
};

const songUrl = () => ({
  data: [
    {
      id: 1372315065,
      url: 'http://m7.music.126.net/20201225112715/8728e11f2abaed7d51cc0682dbc06b61/ymusic/0458/045d/0e53/32e1619b5937a2622d5299772be062b6.mp3',
      bak_url: 'https://music.163.com/song/media/outer/url?id=1372315065.mp3',
      br: 128000,
      size: 3970238,
      md5: '32e1619b5937a2622d5299772be062b6',
      code: 200,
      expi: 1200,
      type: 'mp3',
      gain: 0,
      fee: 8,
      uf: null,
      payed: 0,
      flag: 68,
      canExtend: false,
      freeTrialInfo: null,
      level: 'standard',
      encodeType: 'mp3',
      freeTrialPrivilege: {
        resConsumable: false,
        userConsumable: false,
      },
      urlSource: 0,
    },
  ],
  code: 200,
});

const songLrc = ({ url }) => {
  const { id } = queryString.parse(url.split('?')[1]);
  return lrcs.find((lyc) => lyc.id === +id);
};

export { musicDetail, songUrl, songLrc };
