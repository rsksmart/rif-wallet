import { ISocketsChangeEmitted } from './types'
import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'

export const useOnNewTransactionEventEmitted = ({
  abiEnhancer,
  wallet,
  dispatch,
}: ISocketsChangeEmitted) => {
  return (payload: IApiTransaction) => {
    abiEnhancer
      .enhance(wallet, {
        from: wallet.smartWalletAddress,
        to: payload.to.toLowerCase(),
        data: payload.input,
        value: payload.value,
      })
      .then(enhancedTransaction => {
        if (enhancedTransaction) {
          dispatch({
            type: 'newTransaction',
            payload: {
              originTransaction: payload,
              enhancedTransaction,
            },
          })
        }
      })
      .catch(() => {
        dispatch({
          type: 'newTransaction',
          payload: {
            originTransaction: payload,
            enhancedTransaction: undefined,
          },
        })
      })
  }
}
