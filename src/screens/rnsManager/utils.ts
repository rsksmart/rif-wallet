import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { AppDispatch } from 'store/index'
import { OnSetTransactionStatusChange } from 'screens/send/types'
import { handleReduxTransactionStatusChange } from 'screens/send/usePaymentExecutor'
import { abiEnhancer } from 'core/setup'

export const handleDomainTransactionStatusChange =
  (dispatch: AppDispatch, wallet: RIFWallet) =>
  async (tx: Parameters<OnSetTransactionStatusChange>[0]) => {
    const txTransformed = tx
    if (txTransformed.txStatus === 'PENDING') {
      const chainId = await wallet.getChainId()
      // decode transaction
      const enhancedTransaction = await abiEnhancer.enhance(chainId, {
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
