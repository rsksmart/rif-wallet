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
      'Sign in with a Master Key': 'Sign in with a Master Key',
      'Input the words you were given when you created your wallet in correct order':
        'Input the words you were given when you created your wallet in correct order',
      Receive: 'Receive',
      'Send Transaction': 'Send Transaction',
      Balances: 'Balances',
      Activity: 'Activity',
      'Change Language': 'Change Language',
      'Sign Message': 'Sign Message',
      sign: 'sign',
      'Sign Typed Data': 'Sign Typed Data',
      'Wallet info': 'Wallet info',
      WalletConnect: 'WalletConnect',
      'Please select your language': 'Please select your language',
      'Welcome to sWallet!': 'Welcome to sWallet!',
      'Transaction Details': 'Transaction Details',
      Token: 'Token',
      Amount: 'Amount',
      From: 'From',
      To: 'To',
      'Loading transactions. Please wait...':
        'Loading transactions. Please wait...',
      'Loading balances. Please wait...': 'Loading balances. Please wait...',
      'TX Hash': 'Tx Hash',
      Gas: 'Gas',
      'Gas Price': 'Gas Price',
      Status: 'Status',
      Time: 'Time',
      Refresh: 'Refresh',
      '< Prev': '< Prev',
      'Next >': 'Next >',
      'View in explorer': 'View in explorer',
      'Return to Activity Screen': 'Return to Activity Screen',

      'Master key': 'Master key',
      'copy the key in a safe place ⎘': 'copy the key in a safe place ⎘',
      'With your master key (seed phrase) you are able to create as many wallets as you need.':
        'With your master key (seed phrase) you are able to create as many wallets as you need.',
      'Enter your 12 words master key': 'Enter your 12 words master key',
      'You will need to refresh the app for this to fully work.':
        'You will need to refresh the app for this to fully work.',
      'Transaction Sent. Please wait...': 'Transaction Sent. Please wait...',
      'Transaction Confirmed.': 'Transaction Confirmed.',
      'Transaction Failed.': 'Transaction Failed',
      'Signing with EOA Account': 'Signing with EOA AccounT',
      Message: 'Message',
      reject: 'reject',
      'Send RIF hash': 'Send RIF hash',
      'Send RIF back to faucet': 'Send RIF back to fauceT',
      'RIF Token balance': 'RIF Token balance',
      'Is Deployed?': 'Is Deployed?',
      Deploying: 'Deploying...',
      Deploy: 'Deploy',
      'Get info': 'Get Info',
      'RBTC Balance (EOA)': 'RBTC Balance (EOA)',
      'Do you want to sign this message?': 'Do you want to sign this message?',

      InjectedBrowser: 'InjectedBrowser',

      'Enter your pin': 'Enter your pin',
      'to unlock the app': 'to unlock the app',
      Pin: 'Pin',
      Unlock: 'Unlock',
      'Your pin is set': 'Your pin is set',
      'Delete your Pin': 'Delete your Pin',
      'Set your pin': 'Set your pin',
      Save: 'Save',
      "Your contact list is empty.": 'Your contact list is empty.',
      "Start by creating a new contact.": 'Start by creating a new contact.',
    },
  },
  es: {
    translation: {
      'Please select your language': 'Por favor seleccionar su idioma',
      'Welcome to sWallet!': 'Bienvenido a sWallet!',
      Refresh: 'Refrescar',
      "Your contact list is empty.": 'Su lista de contactos está vacía.',
      "Start by creating a new contact.": 'Comience creando un nuevo contacto.',
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
