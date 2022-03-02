// export { default as permission } from './permisson';

export const visible = {
  bind: () => {},
  inserted: (el, binding) => {
    const { value = true } = binding;
    el.style.visibility = value ? 'visible' : 'hidden';
  },
  update: (el, binding) => {
    const { value = true } = binding;
    el.style.visibility = value ? 'visible' : 'hidden';
  },
};
