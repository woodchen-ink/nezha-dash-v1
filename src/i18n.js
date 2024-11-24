import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import zhCNTranslation from "./locales/zh-CN/translation.json";
import zhTWTranslation from "./locales/zh-TW/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  "zh-CN": {
    translation: zhCNTranslation,
  },
  "zh-TW": {
    translation: zhTWTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh-CN", // 默认语言
  fallbackLng: "en", // 当前语言的翻译没有找到时，使用的备选语言
  interpolation: {
    escapeValue: false, // react已经安全地转义
  },
});

export default i18n;
