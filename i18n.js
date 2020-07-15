import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './langs/en.json';

const resources = {
  en: { translation: en }
};

i18next
  .use(initReactI18next)
  .init({
    // debug: true,
    fallbackLng: 'en',
    lng: Localization.locale,
    interpolation: {
      escapeValue: false
    },
    resources
  });
