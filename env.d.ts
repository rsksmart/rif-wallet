declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV: string
    RIF_WALLET_SERVICE_URL: string
    RIF_WALLET_SERVICE_PUBLIC_KEY: string
    DEFAULT_CHAIN_TYPE: string
    RIF_WALLET_KEY: string
    WALLETCONNECT2_PROJECT_ID: string
    USE_RELAY: string
    TRACE_ID: string
  }

  export const Config: NativeConfig
  export default Config
}
