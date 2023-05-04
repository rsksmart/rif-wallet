import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

export interface BitcoinTokenBalanceObject extends ITokenWithoutLogo {
  satoshis: number
  bips: Array<BIP>
}

export type TokenBalanceObject = ITokenWithoutLogo | BitcoinTokenBalanceObject

export type BalanceState = {
  tokenBalances: Record<string, TokenBalanceObject>
  totalUsdBalance: string
  loading: boolean
}

export type ITokenWithoutLogo = Omit<ITokenWithBalance, 'logo'>
