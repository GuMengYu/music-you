import VueI18n from 'vue-i18n';
import Vue from 'vue';
import zh from './language/zh';
import en from './language/en';

Vue.use(VueI18n);

export function createI18n(locale = 'zh') {
  return new VueI18n({
    locale,
    messages: {zh, en},
  });
}
