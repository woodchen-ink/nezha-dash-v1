import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./locales/en/translation.json"

const resources = {
  "en-US": {
    translation: enTranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
