import dayjs from '@/plugins/dayjs';
import { optional_chain } from '@util/fn';

const install = function (Vue) {
  Vue.prototype.$dayjs = dayjs;
  Vue.prototype.$ochain = optional_chain;
};

export default {
  install,
};
