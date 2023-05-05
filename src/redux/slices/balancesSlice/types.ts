import { BIPWithRequest } from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

export interface ITokenWithoutLogo extends Omit<ITokenWithBalance, 'logo'> {
  usdBalance: string
}

export interface BitcoinTokenBalanceObject extends ITokenWithoutLogo {
  satoshis: number
  bips: Array<BIPWithRequest>
}

export type TokenBalanceObject = ITokenWithoutLogo | BitcoinTokenBalanceObject

export interface BalanceState {
  tokenBalances: Record<string, TokenBalanceObject>
  totalUsdBalance: string
  loading: boolean
}
