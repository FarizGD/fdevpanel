import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// If we're using HMR use a unique hash per page reload so that we're always
// doing cache busting. Otherwise just use the builder provided hash value in
// the URL to allow cache busting to occur whenever the front-end is rebuilt.
const hash = module.hot ? Date.now().toString(16) : process.env.WEBPACK_BUILD_HASH;

i18n.use(initReactI18next)
    .init({
        debug: process.env.DEBUG === 'true',
        lng: 'en',
        fallbackLng: 'en',
        keySeparator: '.',
        resources: { en: { translation: {}, activity: {} } },
        interpolation: {
            // Per i18n-react documentation: this is not needed since React is already
            // handling escapes for us.
            escapeValue: false,
        },
    });

export default i18n;
