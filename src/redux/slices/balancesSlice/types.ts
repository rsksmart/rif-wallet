import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

export type BalanceState = Record<string, ITokenWithoutLogo>

export type ITokenWithoutLogo = Omit<ITokenWithBalance, 'logo'>
