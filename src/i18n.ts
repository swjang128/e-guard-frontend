import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './components/locales/en/translation.json';
import translationKr from './components/locales/kr/translation.json';
import translationTh from './components/locales/th/translation.json';
import translationVn from './components/locales/vi/translation.json';

// the translations
const resources: any = {
  'en-US': {
    translation: translationEn,
  },
  'ko-KR': {
    translation: translationKr,
  },
  'th-TH': {
    translation: translationTh,
  },
  'vi-VN': {
    translation: translationVn,
  },
};

const language: any = localStorage.getItem('I18N_LANGUAGE');
if (!language) {
  localStorage.setItem('I18N_LANGUAGE', 'ko');
}

i18n
  // .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    fallbackLng: 'ko', // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;