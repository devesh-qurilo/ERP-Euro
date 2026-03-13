import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

// Import translations
import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  es: { translation: es },
};

i18n
  .use(initReactI18next)
  .use({
    type: 'backend',
    backend: {
      backends: [
        {
          init(services, backendOptions) {
            // Custom backend to load JSON directly
            return {
              read(language, namespace, callback) {
                try {
                  const translations = resources[language]?.translation || {};
                  callback(null, translations);
                } catch (err) {
                  callback(err, null);
                }
              },
            };
          },
        },
      ],
    },
  })
  .init({
    resources,
    lng: getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    compatibilityJSON: 'v3', // For RN compatibility
    react: {
      useSuspense: false,
    },
  });

export default i18n;
