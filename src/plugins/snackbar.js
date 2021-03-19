import Vue from 'vue';
import MSnackbar from '@components/default/Snackbar.vue';

let SnackBarConstructor = Vue.extend(MSnackbar);

let seed = 0;
let instance;
const Message = function (options) {
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }
  let id = 'message_' + seed++;
  // let userOnClose = options.onClose;
  // options.onClose = function() {
  //   Message.close(id, userOnClose);
  // };

  instance = new SnackBarConstructor({
    data: options,
  });
  instance.id = id;
  // if (isVNode(instance.message)) {
  //   instance.$slots.default = [instance.message];
  //   instance.message = null;
  // }
  instance.vm = instance.$mount();
  document.getElementById('app').appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  // instances.push(instance);
  return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  Message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return Message(options);
  };
});
export { Message };
