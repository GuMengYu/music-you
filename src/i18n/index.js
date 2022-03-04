import { createI18n as _createI18n } from 'vue-i18n';
import zh from './language/zh';
import en from './language/en';

export function createI18n(store) {
  return _createI18n({
    locale: 'zh',
    fallbackLocale: 'en', // set fallback locale
    messages: { zh, en },
  });
}
