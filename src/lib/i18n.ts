import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      device_compromised: 'DEVICE SECURITY COMPROMISED',
      device_compomised_description:
        'Any "rooted" app can access your private keys and steal your funds. Wipe this wallet immediately and restore it on a secure device.',
      no_selected_wallet: 'No selected wallet',
      address_copied_to_keyboard: 'Address copied to Clipboard',
      mnemonic_copied: 'Mnemonic has been copied to Clipboard!',
      message_copied_to_clipboard: 'Copied to Clipboard',
      ok: 'OK',
      back: 'Go Back',
      basic_row_pending: '• Pending',
      basic_row_failed: '• Failed',
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
      'type to find...': 'type to find...',
      'Are you sure you want to delete': 'Are you sure you want to delete',
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
      initial_screen_button_retry_login: 'Retry unlock',
      initial_screen_button_reset_app: 'Reset App',
      initial_screen_button_create: 'Create a wallet',
      initial_screen_button_import: 'Import existing wallet',
      initial_screen_welcome_footer:
        'Welcome to RIF Wallet - a smart wallet with intuitive UX. Create your profile now.',
      header_import_wallet: 'Import wallet',
      header_enter_your_phrase: 'Enter your phrase',
      header_phrase_correct: 'Phrase is correct!',
      header_phrase_not_correct: 'Phrase is not correct!',
      header_no_username: 'No username',
      header_requesting: 'Requesting username...',
      header_purchase: 'Purchase username',
      header_purchasing: 'Purchasing username...',
      header_error: 'Error Requesting username',
      mnemonic_title: 'Security advice',
      mnemonic_title_copy: 'Copied to clipboard!',
      mnemonic_body: `Please make sure that you are located
      in a safe environment with no one being
      able to see your phone screen before you decide to reveal your phrase. `,
      mnemonic_body_copy:
        'We strongly recommend you to write the phrase also on a piece of paper.',
      new_master_key_title: 'Save your phrase',
      new_master_key_button_title: 'Phrase secured, continue',
      new_master_key_secure_later_button: 'Secure later',
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
      username_registration_title: 'Username Registration',
      request_username_title: 'Request a username',
      request_username_label: 'Length of registration',
      request_username_years: 'years',
      request_username_year: 'year',
      request_username_popup_title: "It's a 2-step process",
      request_username_popup_description:
        'Registering a username requires you to make two transactions in RIF. First transaction is requesting the username. Second transaction is the actual purchase of the username.\nWe are working hard on improving this experience for you!',
      request_username_popup_confirm: 'Ok, thank you',
      purchase_username_duration_label: 'Length of ownership',
      purchase_username_price_label: 'Price',
      purchase_username_button: 'Purchase',
      cancel_username_button: 'Cancel Registration',
      purchase_username_loading: 'Your domain purchase is being requested...',
      username: 'Username',
      username_available: 'Username available',
      username_unavailable: 'Username unavailable',
      username_owned: 'Username owned',
      request_username_button: 'Request',
      save_username_button: 'Save',
      address_validating: 'Validating...',
      address_rns_placeholder: 'Username or address',
      contact_form_title_edit: 'Edit Contact',
      contact_form_title_create: 'Create Contact',
      contact_form_name: 'Name',
      contact_form_name_too_short: 'Contact name is too short',
      contact_form_name_too_long: 'Contact name is too long',
      contact_form_getting_info: 'Getting address for domain...',
      contact_form_user_found: 'User found!',
      contact_form_address_not_found: 'Could not get address for',
      contact_form_address_invalid: 'Invalid address',
      contact_form_checksum_invalid: 'The checksum is invalid.',
      contact_form_network_wrong: 'Wrong network address',
      contact_form_button_save: 'Save Contact',
      contact_form_button_convert_checksum: 'Convert to correct checksum',
      contact_form_button_add_proposed_contact: 'Add',
      contact_form_button_add_proposed_contact_ending: 'to your Contacts',
      contact_form_alert_title: 'Contact already exists!',
      contact_form_edit_existing_button: 'Edit existing contact',
      transaction_form_label_asset: 'asset',
      transaction_form_bitcoin_alert_utxo_title: 'Bitcoin Unspend Transaction',
      transaction_form_bitcoin_alert_utxo_desc:
        'Your Bitcoin balance is the total of all your Unspent Transaction Outputs (UTXOs). Note that you have a limited number of UTXOs available, which collectively make up your displayed balance.',
      transaction_summary_screen_title: 'Transaction Summary',
      transaction_summary_send_title: 'Send',
      transaction_summary_sent_title_success: 'Sent',
      transaction_summary_receive_title: 'Receive',
      transaction_summary_sent_title_pending: 'Sent (pending)',
      transaction_summary_received_title_success: 'Received',
      transaction_summary_received_title_pending: 'Received (pending)',
      transaction_summary_status: 'Status:',
      transaction_summary_button_usd: 'USD',
      transaction_summary_total_send: 'Total send:',
      transaction_summary_total_sent: 'Total sent:',
      transaction_summary_they_send: 'They send:',
      transaction_summary_they_sent: 'They sent:',
      transaction_summary_total_received: 'Total received:',
      transaction_summary_i_receive_text: 'I receive:',
      transaction_summary_i_received_text: 'I received:',
      transaction_summary_you_send_text: 'You send:',
      transaction_summary_fees: 'Fees:',
      transaction_summary_arrives_in_text: 'Arrives in:',
      transaction_summary_arrived_text: 'Arrived:',
      transaction_summary_transaction_hash: 'TX Hash:',
      transaction_summary_default_button_text: 'Close',
      transaction_summary_congrats: 'Congratulations!',
      transaction_summary_you_sent: 'You have sent',
      transaction_summary_your_transaction: 'Your transaction is on the way.',
      transaction_summary_check_status:
        'Check status in your transaction list.',
      transaction_summary_to: 'to',
      transaction_summary_title_confirm_button_title: 'Confirm',
      transaction_summary_title_cancel_button_title: 'Cancel',
      transaction_summary_function_type: 'type',
      transaction_summary_plus_fees: '+ fees',
      transaction_summary_plus_fees_capitalcase: '+ Fees',
      transaction_summary_insufficient_funds: 'Insufficient funds',
      transaction_summary_address_text: 'Address',
      profile_screen_title: 'Profile',
      profile_contact_details_subtitle: 'Contact Details',
      profile_phone_label: 'Phone Number',
      profile_email_label: 'Email',
      profile_address_label: 'Address',
      profile_register_your_username_button_text: 'Register your username',
      no_username: 'No username',
      confirm_key_title: 'Verify your phrase',
      confirm_key_error: 'Wrong words! Try again...',
      confirm_key_input_error: "Words don't match",
      confirm_key_success: 'Phrase verified! ',
      confirm_key_button: 'OK',
      confirm_key_screen_title: 'Wallet backup',
      settings_screen_title: 'Settings',
      settings_screen_account: 'Account',
      settings_screen_accounts: 'Accounts',
      settings_screen_switch_to: 'Switch to',
      settings_screen_wallet_backup: 'Wallet Backup',
      settings_screen_change_pin: 'Change PIN',
      settings_screen_deploy_wallet: 'Deploy Wallet',
      settings_screen_examples: 'Examples Screen',
      settings_screen_version: 'Version',
      settings_screen_smart_wallet_factory: 'Smart Wallet Factory',
      settings_screen_rpc_url: 'RPC URL',
      settings_screen_backend_url: 'Backend URL',
      accounts_screen_status_label: 'Status',
      accounts_screen_deployed_label: 'Deployed',
      accounts_screen_not_deployed_label: 'Not Deployed',
      accounts_screen_address_label: 'Address',
      accounts_screen_eoa_account_label: 'EOA Address',
      accounts_screen_smart_wallet_address_label: 'Smart Wallet Address',
      accounts_screen_public_key_label: 'Public Key',
      accounts_screen_edit_name_label: 'Edit name',
      contacts_screen_title: 'Contacts',
      contacts_empty_list: 'Your contact list is empty.',
      contacts_empty_start: 'Start by creating a new contact.',
      contacts_browse: 'Browse',
      contacts_new_contact_button_label: 'New Contact',
      contacts_search_label: 'Browse Contacts',
      transaction_form_recepient_label: 'Send to',
      transaction_form_balance_label: 'Balance',
      transaction_form_button_send: 'Send',
      transaction_form_button_cancel: 'Cancel',
      transaction_form_tx_dropdown: 'Change tx asset',
      transaction_form_fee_dropdown: 'Change fee asset',
      transaction_form_fee_input_label: 'Pay transaction fee in ',
      transaction_form_error_balance: 'Insufficient balance',
      transaction_confirmed_status: 'confirmed',
      transaction_pending_status: 'pending',
      transaction_failed_status: 'failed',
      transaction_summary_sent_title: 'Sent',
      activity_list_empty: 'Your list of transactions is currently empty.',
      contacts_username_input_label: 'username',
      contacts_address_input_label: 'address',
      contacts_details_transactions: 'Transactions',
      contacts_details_edit_contact: 'Edit contact',
      contacts_delete_contact_title: 'Delete contact',
      contacts_delete_contact_button_delete: 'Yes, delete',

      contacts_delete_contact_description:
        'Do you really wish to delete your contact ',
      wallet_backup_subtitle: 'View your phrase',
      wallet_backup_delete_button: 'Delete Wallet',
      wallet_backup_delete_confirmation_title: 'Delete Wallet?',
      wallet_backup_delete_confirmation_description:
        'Make sure that you have saved your seed phrase. Without the seed phrase, recovery of your funds will not be possible in a new wallet.',
      wallet_backup_definitive_delete_confirmation_title: 'Are you sure?',
      wallet_backup_definitive_delete_confirmation_description:
        'Do you really want to erase the wallet with all the funds and information saved in it?',
      dapps_title: 'Dapps',
      dapps_instructions:
        'Scan & connect to your favorite desktop app. Connections will appear here.',
      dapps_confirmation_title: 'Connect?',
      dapps_confirmation_description: 'Do you want to connect to the Dapp',
      dapps_confirmation_button_connect: 'Connect',
      dapps_confirmation_button_cancel: 'Reject',
      dapps_connected: 'Connected',
      dapps_disconnecting: 'Disconnecting',
      dapps_confirm_disconnection_title: 'Disconnect?',
      dapps_confirm_disconnection_description:
        'Do you want to disconnect from the Dapp',
      dapps_confirm_disconnection_confirm: 'Disconnect',
      dapps_confirm_disconnection_cancel: 'Reject',
      dapps_sign_message_request_type: 'Request type',
      alias_bought_congratulations: 'Congratulations!',
      alias_bought_you_requested_domain: 'You have requested your domain.',
      alias_bought_transaction_processing:
        'Your transactions is being processed.',
      alias_bought_close_button: 'Close',
      search_domain_error_request_rejected: 'The request was rejected.',
      search_domain_error_funds_low:
        'Your balance is too low to request an username.',
      search_domain_random_error:
        'There was an error with the request. Please try again later.',
      search_domain_processing_commitment:
        'Your profile commitment is being processed. Please wait.',
      search_domain_min_error:
        'Domains with less than 5 characters coming soon.',
      search_domain_lowercase_error: 'Only lower cases and numbers are allowed',
      pin_screen_pin_setup: 'PIN setup',
      pin_screen_change_pin: 'Change PIN',
      pin_screen_default_title: 'Enter PIN',
      pin_screen_old_pin_title: 'Enter old PIN',
      pin_screen_new_pin_title: 'New PIN',
      pin_screen_confirm_pin_title: 'Confirm PIN',
      pin_screen_header_title: 'PIN',
      pin_screen_wrong_pin: 'Wrong PIN',
      pin_settings_open_keyboard_btn: 'Open Keyboard',
      wallet_deploy_title: 'Deploy RIF wallet',
      wallet_deploy_desc1:
        'RIF wallet is a smart contract and because of this, it needs to be deployed in the blockchain.',
      wallet_deploy_desc2:
        'This deployment makes it possible for you to transfer funds and interact with any web3 dApp.',
      wallet_deploy_wallet_deployed: 'Your smart wallet has been deployed!',
      wallet_deploy_wallet_deploying: 'Deploying wallet...',
      wallet_deploy_button_title: 'Deploy wallet',
      wallet_deploy_error: 'Tx failed, could not deploy smart wallet',
      wallet_deploy_deploying_alert_title: 'Wallet deployment is in progress',
      wallet_deploy_deploying_alert_body:
        'You need to wait until this process is finished before making transactions',
      receive_screen_username_label: 'Username',
      received_from: 'Received from',
      sent_to: 'Sent to',
      camera_alert_title: 'For this feature we need your camera',
      camera_alert_body:
        'You denied permissions to use the camera, please allow to continue',
      camera_alert_button_open_settings: 'Open Settings',
      camera_alert_button_cancel: 'Cancel',
      mining_fee: 'Mining Fee',
      bitcoin_validation_zero_inputs:
        "You don't have transaction inputs to complete this payment.",
      bitcoin_validation_inputs_not_enough:
        'There are not enough transaction inputs to complete this payment.',
      send_alert_ongoing_transaction_title: 'You have an ongoing transaction',
      send_alert_ongoing_transaction_body:
        'Please, wait for previous transaction to succeed or fail before making the next one',
      send_screen_sending_transaction: 'Sending transaction...',
      send_screen_return_to_home: 'Return to Home Screen',
      send_transaction_popup: 'Invalid "to" address, rejecting transaction',
      security_info_header: 'Security Information',
      security_info_user_agreement: 'User agreement',
      security_info_disclaimer:
        '"IOV Labs cannot be held responsible for any loss or theft of your funds.',
      security_info_disclaimer2:
        'It is your sole responsibility to secure and back up your wallet credentials, including private keys or recovery phrases.',
      security_info_disclaimer3:
        'We cannot assist with recovering or reversing any unauthorized or mistaken transactions.',
      security_info_disclaimer4:
        'We strongly advise exercising caution, employing the best security practices,and safeguarding your assets diligently."',
      security_i_agree: 'I agree with the conditions. ',
      security_info_btn: 'Continue',
      security_terms_and_conditions: 'Terms and Conditions',
      android_qr_alert_title: 'Error reading QR',
      android_qr_alert_desc: 'The QR could not be parsed. Please try again.',
      android_qr_loading_camera: 'Loading camera',
      offline_screen_title: 'Ops! You are offline.',
      offline_screen_description_1:
        'RIF Wallet needs an internet connection to work properly.',
      offline_screen_description_2:
        'Please check your connection and try again.',
      dapps_requirements_not_met:
        'The Dapp you tried to connect does not meet our requirements.',
      dapps_session_rejected: 'Session rejected',
      dapps_error_pairing_title: 'Error when trying to connect to Dapp',
      dapps_error_pairing_message: 'Please refresh the QR and try again.',
      dapps_wc_connect: 'Connect',
      dapps_wc_label: 'WC URI',
      dapps_insert_wc_uri: 'Insert WC URI',
      dapps_uri_not_valid_title: 'Invalid URI',
      dapps_uri_not_valid_message:
        'URI is not valid. Please try with a new URI.',
      popup_message_rns:
        'Register your username to allow others to send you funds without worrying about mistyping or inputting wrong address',
      popup_not_possible_to_register_rns:
        'It is not possible to register RNS domain at this time',
      popup_link_text: 'Get username here',
      wallet_deployment_label: 'Rif Wallet Deployment',
      wallet_backup_title: 'Warning!',
      wallet_backup_message:
        'We have disabled the ability to take a picture of the mnemonic because it is important that you keep it private. Please write it down instead',
      global_error_title: 'Oops... Something went wrong!',
      global_error_subtitle: 'We are working hard to fix it.',
      global_error_details_title: 'error details',
      global_trace_id_error: 'Trace Id is not valid',
    },
  },
  es: {
    translation: {
      'Please select your language': 'Por favor seleccionar su idioma',
      Refresh: 'Refrescar',
      'type to find...': 'escriba para buscar...',
      'Are you sure you want to delete': '¿Está seguro de que desea eliminar',
      'Connect to': 'Conectar a',
      Connect: 'Conectar',
      Reject: 'Rechazar',
      Delete: 'Eliminar',
      Cancel: 'Cancelar',
      contacts_empty_list: 'Su lista de contactos está vacía.',
      contacts_empty_start: 'Comience creando un nuevo contacto.',
    },
  },
}

export default i18n
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
