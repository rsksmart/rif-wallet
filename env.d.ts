declare module 'react-native-config' {
  interface Env {
    APP_ENV: string
    RIF_WALLET_SERVICE_URL: string
    DEFAULT_CHAIN_TYPE: string
    RIF_WALLET_KEY: string
    MAGIC_KEY: string
    MAGIC_ENABLED: string
  }

  export const Config: Env
}
