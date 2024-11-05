import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFA from './translations/fa.json';
import translationEN from './translations/en.json';

const resources = {
    fa: { translation: translationFA },
    en: { translation: translationEN }
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'fa',
    // keySeparator: false,
    // interpolation: {
    //     escapeValue: false
    // }
})

export default i18n