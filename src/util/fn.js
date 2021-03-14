const reducer = (object, property) => {
  return object?.[property] ?? undefined;
}
export const optional_chain = (...parameters) => {
  const [source, ...properties] = parameters
  return properties.reduce(reducer, source);
}
/**
 * 休眠
 * @param time
 * @returns {Promise<unknown>}
 */
export const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}
export const formatLyric = (lyric = '') => {
  return lyric.split('\n')?.map(i => {
    const reg = new RegExp(/\[\d*:\d*((\.|:)\d*)*\]/, 'g');
    let [time] = i.match(reg) || [];
    const sentence = i.match(/](\S*)/)[1] || i;
    // [00:27.54]The many miles we walked
    if (time) {
      const min = Number(time.match(/\[(\d*)/i)[1]);
      const sec = Number(time.match(/:(\d*)/i)[1]);
      time = min * 60 + sec;
    }
    return {
      time,
      sentence,
    }
  })
}

export {formatDuring, sizeOfImage, formatNumber} from '@/filters'
