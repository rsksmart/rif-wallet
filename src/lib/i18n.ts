import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      'Create master key': 'Create master key',
      'Reveal master key': 'Reveal master key',
      Receive: 'Receive',
      'Send Transaction': 'Send Transaction',
      Balances: 'Balances',
      Activity: 'Activity',
      'Change Language': 'Change Language',
      'Sign Message': 'Sign Message',
      'Sign Typed Data': 'Sign Typed Data',
      'Wallet info': 'Wallet info',
      WalletConnect: 'WalletConnecT',

      'Please select your language': 'Please select your languageTTT',
      'Welcome to sWallet!': 'Welcome to sWallet!TTT',
      'Transaction Details': 'Transaction DetailsTTT',
      Token: 'TokenTTT',
      Amount: 'AmountTTT',
      From: 'FromTTT',
      To: 'ToTTT',
      'Loading transactions. Please wait...':
        'Loading transactions. Please wait...TTT',
      'Loading balances. Please wait...': 'Loading balances. Please wait...TTT',
      'TX Hash': 'Tx HashTTT',
      Gas: 'GasTTT',
      'Gas Price': 'Gas PriceTTT',
      Status: 'StatusTTT',
      Time: 'TimeTTT',
      Refresh: 'RefreshTTT',
      'View in explorer': 'View in explorerTTT',
      'Return to Activity Screen': 'Return to Activity ScreenTTT',

      'Master key': 'Master key',
      'copy the key in a safe place ⎘': 'copy the key in a safe place ⎘',
      'With your master key (seed phrase) you are able to create as many wallets as you need.':
        'With your master key (seed phrase) you are able to create as many wallets as you need.',
      'Enter your 12 words master key': 'Enter your 12 words master key',
      'You will need to refresh the app for this to fully work.':
        'You will need to refresh the app for this to fully work.TTT',
      'Transaction Sent. Please wait...': 'Transaction Sent. Please wait...TTT',
      'Transaction Confirmed.': 'Transaction Confirmed.TTT',
      'Transaction Failed.': 'Transaction FailedTTT',
      'Signing with EOA Account': 'Signing with EOA AccountTTT',
      Message: 'MessageTTT',
      Reject: 'RejectTTT',
      'Send RIF hash': 'Send RIF hashTTT',
      'Send RIF back to faucet': 'Send RIF back to faucetTTT',
      'RIF Token balance': 'RIF Token balanceTTT',
      'Is Deployed?': 'Is Deployed?TTT',
      Deploy: 'DeployTTT',
      'Get info': 'Get InfoTTT',
      'RBTC Balance (EOA)': 'RBTC Balance (EOA)TTT',
      'Do you want to sign this message?':
        'Do you want to sign this message?TTT',
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
