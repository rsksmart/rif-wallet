import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'

import { AppDispatch } from 'store/index'
import { OnSetTransactionStatusChange } from 'screens/send/types'
import { handleReduxTransactionStatusChange } from 'screens/send/usePaymentExecutor'
import { Wallet } from 'shared/wallet'

export const handleDomainTransactionStatusChange =
  (dispatch: AppDispatch, wallet: Wallet) =>
  async (tx: Parameters<OnSetTransactionStatusChange>[0]) => {
    const txTransformed = tx
    if (txTransformed.txStatus === 'PENDING') {
      // initialize ABI enhancer
      const abiEnhancer = new AbiEnhancer()
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
