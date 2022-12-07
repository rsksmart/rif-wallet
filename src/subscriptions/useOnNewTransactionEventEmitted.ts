import { ISocketsChangeEmitted } from './types'
import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { addNewTransaction } from 'store/slices/transactionsSlice/transactionsSlice'
import { IEnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'
import { useAppDispatch } from 'src/redux/storeUtils'

export const useOnNewTransactionEventEmitted = ({
  abiEnhancer,
  wallet,
}: ISocketsChangeEmitted) => {
  const dispatch = useAppDispatch()

  return async (payload: IApiTransaction) => {
    const payloadToUse: {
      originTransaction: IApiTransaction
      enhancedTransaction?: IEnhancedResult
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
