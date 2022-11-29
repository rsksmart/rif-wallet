import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'

export type BalanceState = Record<string, ITokenWithoutLogo>

export type ITokenWithoutLogo = Omit<ITokenWithBalance, 'logo'>
