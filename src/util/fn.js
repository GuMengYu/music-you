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
  return lyric.split('\n').filter(i => !!i)?.map(i => {
    const reg = new RegExp(/\[\d*:\d*((\.|:)\d*)*\]/, 'g');
    let [time] = i.match(reg) || [];
    let sentence = i.match(/](.*)/)[1];
    // [by: ***]
    // [00:27.54]The many miles we walked
    // [00:56.33]
    // [00:59.54] That's the way it is
    if (time) {
      const min = Number(time.match(/\[(\d*)/i)[1]);
      const sec = Number(time.match(/:(\d*)/i)[1]);
      const mill = time.match(/\.(\d*)]/i)?.[1];
      const millToSec = +(Number(mill ?? 0) / 1000).toFixed(2);
      time = min * 60 + sec + millToSec;
      sentence = sentence || '';
    } else {
      sentence = sentence || i;
    }
    return {
      time,
      sentence,
    }
  })
}

export {formatDuring, sizeOfImage, formatNumber} from '@/filters'
