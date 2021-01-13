import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';

import translationEN from '../Assets/locales/en/strings.json';
import translationVi from '../Assets/locales/vi/strings.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVi,
  },
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
