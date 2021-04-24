const permission = {
  bind: (el, binding, vnode) => {
    console.log(el, binding, vnode);
    const { $store: store } = vnode.context;
    const { value } = binding;
    if (store.getters['app/ckp'](value)) {
      console.log(el.parentNode);
    }
  },
  inserted: () => {
    console.log('inserted');
  },
  update: () => {
    console.log('update');
  },
};
export default permission;
