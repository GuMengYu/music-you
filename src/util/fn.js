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

export {formatDuring, sizeOfImage, formatNumber} from '@/filters'
