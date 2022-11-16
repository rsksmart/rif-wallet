import { RIFWallet } from '../lib/core'
import { Dispatch } from './types'
import { constants } from 'ethers'
import { ITokenWithBalance } from '../lib/rifWalletServices/RIFWalletServicesTypes'

export const loadRBTCBalance = async (
  wallet: RIFWallet,
  dispatch: Dispatch,
) => {
  const rbtcBalanceEntry = await wallet.provider!.getBalance(wallet.address)

  const newEntry = {
    name: 'TRBTC (EOA)',
    logo: 'TRBTC',
    symbol: 'TRBTC',
    contractAddress: constants.AddressZero,
    decimals: 18,
    balance: rbtcBalanceEntry.toString(),
  } as ITokenWithBalance

  !rbtcBalanceEntry.isZero() &&
    dispatch({ type: 'newBalance', payload: newEntry })
}
