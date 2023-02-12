import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'

import { addNewTransaction } from 'store/slices/transactionsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { ISocketsChangeEmitted } from './types'

export const useOnNewTransactionEventEmitted = ({
  abiEnhancer,
  wallet,
}: ISocketsChangeEmitted) => {
  const dispatch = useAppDispatch()

  return async (payload: IApiTransaction) => {
    const payloadToUse: {
      originTransaction: IApiTransaction
      enhancedTransaction?: EnhancedResult
    } = {
      originTransaction: payload,
      enhancedTransaction: undefined,
    }
    try {
      const enhancedTransaction = await abiEnhancer.enhance(wallet, {
        from: wallet.smartWalletAddress,
        to: payload.to.toLowerCase(),
        data: payload.input,
        value: payload.value,
      })
      if (enhancedTransaction) {
        payloadToUse.enhancedTransaction = enhancedTransaction
      }
    } catch (err) {
    } finally {
      dispatch(addNewTransaction(payloadToUse))
    }
  }
}
