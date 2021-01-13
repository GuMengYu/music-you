import VueI18n from 'vue-i18n';
import Vue from 'vue';
import zh from './language/zh';
import en from './language/en';

Vue.use(VueI18n);

export default (locale = 'zh') => new VueI18n({
    locale,
    messages: {zh, en},
});
