/**
 * 函数防抖
 * @param fn
 * @param {Integer} wait : 延迟执行毫秒数
 * @param {Boolean} immediate : 是否立即执行
 */
export const debounce = (fn, wait= 1000, immediate) => {
    let timeout;
    return function() {
        timeout && clearTimeout(timeout);
        if (immediate) {
            let callNow = !timeout;
             timeout = setTimeout(() => {
                 timeout = null;
             }, wait);
            callNow && fn.apply(this, arguments);
        } else {
            timeout = setTimeout(() => {
                fn.apply(this, arguments);
            }, wait);
        }
    };
};

/**
 * 函数节流 定时器版
 * @param {*} fn
 * @param {*} wait
 */
export const throttle = (fn, wait = 500) => {
    let timeout;
    return function() {
        if (!timeout) {
            timeout = setTimeout(() => {
                fn.apply(this, arguments);
                timeout = null;
            }, wait);
        }
    };
};

/**
 * 函数节流 时间戳版
 * @param {*} fn
 * @param {*} wait
 */
export const throttle_timestamp = (fn, wait) => {
    let previous = 0, timeout, context, args;
    const later = () => {
        previous = new Date().getTime();
        timeout = null;
        fn.apply(context, args);
    };
    return function() {
        context = this;
        args = arguments;
        let now = new Date().getTime();
        let remaining = wait - (now - previous);
        if (remaining <=0 || remaining > wait) {
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            fn.apply(context, args);
        } else if (!timeout){
            timeout = setTimeout(later, remaining);
        }
    };
};

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

export {formatDuring, sizeOfImage} from '@/filters'
