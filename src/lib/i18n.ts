import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      type_placeholder: 'type...',
      err_unknown: 'Unknown error occurred',
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

      'Enter your pin': 'Enter your pin',
      'to unlock the app': 'to unlock the app',
      Pin: 'Pin',
      Unlock: 'Unlock',
      'Your pin is set': 'Your pin is set',
      'Delete your Pin': 'Delete your Pin',
      'Set your pin': 'Set your pin',
      Save: 'Save',
      'Your contact list is empty.': 'Your contact list is empty.',
      'Start by creating a new contact.': 'Start by creating a new contact.',
      'type to find...': 'type to find...',
      'Are you sure you want to delete': 'Are you sure you want to delete',
      'Connected Dapps': 'Connected Dapps',
      'Connect new Dapp by scanning a QR code.':
        'Connect new Dapp by scanning a QR code.',
      'You are currently not': 'You are currently not',
      'connected to any Dapp.': 'connected to any Dapp.',
      'Connect to': 'Connect to',
      Connect: 'Connect',
      Reject: 'Reject',
      Delete: 'Delete',
      Cancel: 'Cancel',
      TOTAL: 'TOTAL',
      search_placeholder: 'Search by username or email',
      home_screen_portfolio: 'Portfolio',
      home_screen_transactions: 'Transactions',
      home_screen_empty_transactions: 'Transaction list is empty',
      home_screen_no_transactions_created:
        'You have not created any transactions yet',
      info_box_title_search_domain: 'Username & Icon',
      info_box_description_search_domain:
        'Register your username to allow others to send you funds more easily. In case you do not have any RIF funds you can ask a friend to send you some RIF.',
      info_box_close_button: 'close',
      initial_screen_title: 'Wallet',
      initial_screen_button_create: 'Create a wallet',
      initial_screen_button_import: 'Import existing',
      header_no_username: 'No username',
      header_requesting: 'Requesting username...',
      header_purchase: 'Purchase username',
      header_purchasing: 'Purchasing username...',
      header_error: 'Error Requesting username',
      request_username_label: 'Length of registration',
      request_username_placeholder: 'year',
      mnemonic_title: 'Security advice',
      mnemonic_title_copy: 'Copied to clipboard!',
      mnemonic_body: `Please make sure that you are located 
      in a safe environment with no one being
      able to see your phone screen before you decide to reveal your phrase. `,
      mnemonic_body_copy:
        'We strongly recommend you to write the phrase also on a piece of paper.',
      new_master_key_title: 'Save your phrase',
      new_master_key_button_title: 'Phrase secured, Continue',
      change_asset: 'Change asset',
      loading_qr: 'Loading QR',
      loading_address: 'Loading Address',
      close: 'Close',
      next: 'Next',
      home_information_bar_title: 'Get Started',
      home_information_bar_desc1:
        'We recommend you to start by funding your wallet.',
      home_information_bar_desc2:
        'Deploy your wallet and send funds to your family and friends. ',
      home_information_bar_desc3:
        'Register your username and receive your icon.',
      address_rns_placeholder: 'Username or address',
      contact_form_name: 'Name',
      contact_form_getting_info: 'Getting address for domain...',
      contact_form_user_found: 'User found!',
      contact_form_address_not_found: 'Could not get address for',
      contact_form_address_invalid: 'Invalid address',
      contact_form_checksum_invalid: 'The checksum is invalid.',
      contact_form_button_save: 'Save Contact',
      contact_form_button_convert_checksum: 'Convert to correct checksum',
    },
  },
  es: {
    translation: {
      'Please select your language': 'Por favor seleccionar su idioma',
      Refresh: 'Refrescar',
      'Your contact list is empty.': 'Su lista de contactos está vacía.',
      'Start by creating a new contact.': 'Comience creando un nuevo contacto.',
      'type to find...': 'escriba para buscar...',
      'Are you sure you want to delete': '¿Está seguro de que desea eliminar',
      'Connected Dapps': 'Dapps conectadas',
      'Connect new Dapp by scanning a QR code.':
        'Conecte una nueva Dapp escaneando un código QR.',
      'You are currently not': 'Actualmente no',
      'connected to any Dapp.': 'conectado a ninguna Dapp.',
      'Connect to': 'Conectar a',
      Connect: 'Conectar',
      Reject: 'Rechazar',
      Delete: 'Eliminar',
      Cancel: 'Cancelar',
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
