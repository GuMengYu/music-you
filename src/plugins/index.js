
import { Message } from './snackbar';
import Global from 'vue';
import dayjs from './dayjs';
import { optionalChaining } from '@util/fn';

const install = function(Vue) {
    Vue.prototype.$message = Message;
    Vue.prototype.$dayjs = dayjs;
    Vue.prototype.$$ = optionalChaining;
    Vue.prototype.$eventHub = new Global();
  };

export default {
    install,
};
