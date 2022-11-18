import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'

export type BalanceState = Record<string, ITokenWithBalance>

export type ITokenWithoutLogo = Omit<ITokenWithBalance, 'logo'>
