import { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { AbiEnhancer } from '../../lib/abiEnhancer/AbiEnhancer'
import { RIFWallet } from '../../lib/core'

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

const useEnhancedWithGas = (wallet: RIFWallet, tx: TransactionRequest) => {
  const [enhancedTransactionRequest, setEnhancedTransactionRequest] =
    useState<TransactionRequest>({
      gasPrice: '0',
      gasLimit: '0',
    })
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const gasLimitEstimate = wallet.smartWallet
      .estimateDirectExecute(tx.to || '0x', tx.data || '0x')
      .then((estimate: BigNumber) => {
        if (tx.gasLimit && estimate.lt(tx.gasLimit)) {
          return tx.gasLimit
        } else {
          return estimate
        }
      })

    const gasPriceEstimate = wallet.provider
      ?.getGasPrice()
      .then((gp: BigNumber) => gp.mul('101').div('100'))
      .then((estimate: BigNumber) => {
        if (tx.gasPrice && estimate.lt(tx.gasPrice)) {
          return tx.gasPrice
        } else {
          return estimate
        }
      })

    const enhancer = abiEnhancer.enhance(wallet, tx)

    Promise.all([gasLimitEstimate, gasPriceEstimate, enhancer]).then(result => {
      const txEnhanced = convertTransactionToStrings({
        ...result[2],
        gasLimit: result[0] || 0,
        gasPrice: result[1] || 0,
      })

      setEnhancedTransactionRequest(txEnhanced)
      setIsLoaded(true)
    })
  }, [tx, wallet])

  const setGasLimit = (gasLimit: string) =>
    setEnhancedTransactionRequest({ ...enhancedTransactionRequest, gasLimit })
  const setGasPrice = (gasPrice: string) =>
    setEnhancedTransactionRequest({ ...enhancedTransactionRequest, gasPrice })

  return { enhancedTransactionRequest, isLoaded, setGasLimit, setGasPrice }
}

export default useEnhancedWithGas
