import mixin from './mixin';

export default (Vue) => {
  console.log('install player');
  Vue.mixin(mixin);
};
