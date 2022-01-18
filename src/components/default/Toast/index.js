import Toast from './Toast.vue';

function init(Vue, globalOptions = {}, vuetify) {
  let cmp = null;
  const queue = [];
  const property = globalOptions.property || '$toast';

  function createCmp(options) {
    const ToastConstructor = Vue.extend(Toast);
    const component = new ToastConstructor({ vuetify });
    const componentOptions = {
      ...Vue.prototype[property].globalOptions,
      ...options,
    };

    if (componentOptions.slot) {
      component.$slots.default = componentOptions.slot;
      delete componentOptions.slot;
    }

    Object.assign(component, componentOptions);
    document.body.appendChild(component.$mount().$el);

    return component;
  }

  function show(message, options = {}) {
    if (cmp) {
      const isQueueable =
        options.queueable !== undefined
          ? options.queueable
          : globalOptions.queueable;

      if (isQueueable) {
        queue.push({ message, options });
      } else {
        cmp.close();
        queue.unshift({ message, options });
      }

      return;
    }

    options.message = message;
    cmp = createCmp(options);
    cmp.$on('statusChange', (isActive, wasActive) => {
      if (wasActive && !isActive) {
        cmp.$nextTick(() => {
          cmp.$destroy();
          cmp = null;

          if (queue.length) {
            const toast = queue.shift();
            show(toast.message, toast.options);
          }
        });
      }
    });
  }

  function shorts(options) {
    const colors = ['success', 'info', 'error', 'warning'];
    const methods = {};

    colors.forEach((color) => {
      methods[color] = (message, options) =>
        show(message, { color, ...options });
    });

    if (options.shorts) {
      for (let key in options.shorts) {
        const localOptions = options.shorts[key];
        methods[key] = (message, options) =>
          show(message, { ...localOptions, ...options });
      }
    }

    return methods;
  }

  function getCmp() {
    return cmp;
  }

  function clearQueue() {
    return queue.splice(0, queue.length);
  }

  Vue.prototype[property] = Object.assign(show, {
    globalOptions,
    getCmp,
    clearQueue,
    ...shorts(globalOptions),
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(init);
}

export default init;
