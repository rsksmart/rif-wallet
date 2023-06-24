import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'

import { AppDispatch } from 'src/redux'
import { OnSetTransactionStatusChange } from 'screens/send/types'
import { handleReduxTransactionStatusChange } from 'screens/send/usePaymentExecutor'

export const handleDomainTransactionStatusChange =
  (dispatch: AppDispatch, wallet: RIFWallet) =>
  async (tx: Parameters<OnSetTransactionStatusChange>[0]) => {
    const txTransformed = tx
    if (txTransformed.txStatus === 'PENDING') {
      // initialize ABI enhancer
      const abiEnhancer = new AbiEnhancer()
      // decode transaction
      const enhancedTransaction = await abiEnhancer.enhance(wallet, {
        data: txTransformed.data,
      })
      if (enhancedTransaction) {
        // transform it
        txTransformed.symbol = enhancedTransaction.symbol
        txTransformed.enhancedAmount = enhancedTransaction.value?.toString()
      }
    }
    // pass it to redux
    handleReduxTransactionStatusChange(dispatch)(txTransformed)
  }
