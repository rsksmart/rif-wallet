import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      'Create master key': 'Create master keyTTT',
      'Reveal master key': 'Reveal master keyTTT',
      Receive: 'ReceiveTTT',
      'Send Transaction': 'Send TransactionTTT',
      Balances: 'BalancesTTT',
      Activity: 'ActivityTTT',
      'Change Language': 'Change LanguageTTT',
      'Sign Message': 'Sign MessageTTT',
      'Sign Typed Data': 'Sign Typed DataTTT',
      'Wallet info': 'Wallet infoTTT',
      WalletConnect: 'WalletConnectTTT',

      'Please select your language': 'Please select your languageTTT',
      'Welcome to sWallet!': 'Welcome to sWallet!TTT',
      'Transaction Details': 'Transaction DetailsTTT',
      Token: 'TokenTTT',
      Amount: 'AmountTTT',
      From: 'FromTTT',
      To: 'ToTTT',
      'Loading transactions. Please wait...TTT':
        'Loading transactions. Please wait...TTT',
      'TX Hash': 'Tx HashTTT',
      Gas: 'GasTTT',
      'Gas Price': 'Gas PriceTTT',
      Status: 'StatusTTT',
      Time: 'TimeTTT',
      Refresh: 'RefreshTTT',
      'View in explorer': 'View in explorerTTT',
      'Return to Activity Screen': 'Return to Activity ScreenTTT',

      'Master key': 'Master keyTTT',
      'copy the key in a safe place ⎘': 'copy the key in a safe place ⎘TTT',
      'With your master key (seed phrase) you are able to create as many wallets as you need.':
        'With your master key (seed phrase) you are able to create as many wallets as you need.TTT',
      'Enter your 12 words master key': 'Enter your 12 words master keyTTT',
      'You will need to refresh the app for this to fully work.':
        'You will need to refresh the app for this to fully work.TTT',
    },
  },
  es: {
    translation: {
      'Please select your language': 'Por favor seleccionar su idioma',
      'Welcome to sWallet!': 'Bienvenido a sWallet!',
      Refresh: 'Refrescar',
    },
  },
}

export const i18nInit = () =>
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
