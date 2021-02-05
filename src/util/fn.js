/**
 * 函数防抖
 * @param {() => {}} fn
 * @param {Integer} wait : 延迟执行毫秒数
 * @param {Boolean} immidiate : 是否立即执行
 */
export const debounce = (fn, wait= 1000, immidiate) => {
    let timeout;
    return function() {
        timeout && clearTimeout(timeout);
        if (immidiate) {
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
 * @param {*} options : {  }
 */
export const throttle_timeout = (fn, wait) => {
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
 * @param {*} options : {  }
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
export const optionalChaining = (obj, ...rest) => {
    let temp = obj;
    rest.forEach(key => temp = temp?.[key]);
    return temp;
};

export default {
    optionalChaining,
    debounce,
    throttle_timeout,
    throttle_timestamp,
};
