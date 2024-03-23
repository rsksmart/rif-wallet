import { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { isAddress } from '@rsksmart/rsk-utils'

import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { Wallet } from 'shared/wallet'
import { TokenSymbol } from 'screens/home/TokenImage'

// enhanceWithGas
const abiEnhancer = new AbiEnhancer()

const convertValueToString = (value?: object | boolean | string) =>
  value ? value.toString() : ''
const convertNumberToString = (value?: number) =>
  value ? value.toString() : '0'

const convertTransactionToStrings = (tx: TransactionRequest) => ({
  ...tx,
  to: convertValueToString(tx.to),
  from: convertValueToString(tx.from),
  data: convertValueToString(tx.data),
  gasLimit: convertNumberToString(Number(tx.gasLimit)),
  gasPrice: convertNumberToString(Number(tx.gasPrice)),
})

export interface EnhancedTransactionRequest extends TransactionRequest {
  symbol?: TokenSymbol
  functionName?: string
  functionParameters?: string[]
}

export const enhanceWithGas = async (
  wallet: Wallet,
  tx: TransactionRequest,
  chainId: ChainTypesByIdType,
): Promise<EnhancedTransactionRequest | TransactionRequest> => {
  try {
    // avoid to call estimateGas if the tx.to address is not valid
    if (tx.to && !isAddress(tx.to)) {
      console.log(`TRANSACTION TO VALUE IS NOT A VALID ADDRESS: ${tx.to}`)
      return tx
    }

    const gasLimitEstimate = await wallet
      .estimateGas({ to: tx.to || '0x', data: tx.data || '0x' })
      .then((estimate: BigNumber) => {
        if (tx.gasLimit && estimate.lt(tx.gasLimit)) {
          return tx.gasLimit
        } else {
          return estimate
        }
      })

    const gasPriceEstimate = await wallet.provider
      ?.getGasPrice()
      .then((gp: BigNumber) => gp.mul('101').div('100'))
      .then((estimate: BigNumber) => {
        if (tx.gasPrice && estimate.lt(tx.gasPrice)) {
          return tx.gasPrice
        } else {
          return estimate
        }
      })

    const enhancedTx = await abiEnhancer.enhance(chainId, tx)

    const txEnhanced = convertTransactionToStrings({
      ...enhancedTx,
      gasLimit: gasLimitEstimate || 0,
      gasPrice: gasPriceEstimate || 0,
    })

    return txEnhanced
  } catch (err) {
    throw err
  }
}
