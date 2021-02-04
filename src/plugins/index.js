
import { Message } from '@/plugins/snackbar';
import dayjs from '@/plugins/dayjs';
import { optionalChaining } from '@util/fn';

const install = function(Vue) {
    Vue.prototype.$message = Message;
    Vue.prototype.$dayjs = dayjs;
    Vue.prototype.$$ = optionalChaining;
  };

export default {
    install,
};
