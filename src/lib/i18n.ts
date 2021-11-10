import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      'Welcome to sWallet!': 'Welcome to sWallet!',
      'Transaction Details': 'Transaction Details',
      Token: 'Token',
      Amount: 'Amount',
      From: 'From',
      To: 'To',
      'Loading transactions. Please wait...':
        'Loading transactions. Please wait...',
      'TX Hash': 'Tx Hash',
      Gas: 'Gas',
      'Gas Price': 'Gas Price',
      Status: 'Status',
      Time: 'Time',
      Refresh: 'Refresh',
      'View in explorer': 'View in explorer',
      'Return to Activity Screen': 'Return to Activity Screen',
    },
  },
  es: {
    translation: {
      'Welcome to sWallet!': 'Bienvenido a sWallet!',
      Refresh: 'Refrescar',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'en',
    debug: true,
    compatibilityJSON: 'v3',
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
