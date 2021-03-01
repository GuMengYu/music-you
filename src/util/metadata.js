import Colors from 'vuetify/lib/util/colors'
export const officialPlaylist = {
  2829816518: {
    title: '欧美私人订制',
  },
  2821115454: {
    title: '一周原创发现',
  },
  2409342460: {
    title: '一周新歌推荐',
  },
  2859214503: {
    title: '一周欧美上新',
  },
  2890490211: {
    title: '助眠鸟鸣声',
  },
  2890501416: {
    title: '助眠白噪声',
  },
  5217150082: {
    title: '摇滚唱片行',
  },
  2829961453: {
    title: '古风音乐大赏',
  },
  5212729721: {
    title: '欧美点唱机',
  },
  2860654884: {
    title: '独立女声精选',
  },
}

export const specialType = {
  5: {
    title: '我喜欢的音乐',
  },
  100: {
    title: '私人雷达',
  },
}

export function getColorTable() {
  const o = {};
  Object.entries(Colors).map(([k, v]) => {
    v.base && (o[k] = v.base);
  });
  return o;
}
