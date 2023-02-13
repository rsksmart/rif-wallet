import { useState, useEffect, useMemo, useCallback } from 'react'
import { BigNumber } from 'ethers'
import {
  convertBtcToSatoshi,
  convertSatoshiToBtcHuman,
  validateAmount,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

import {
  convertTokenToUSD,
  convertUSDtoToken,
  sanitizeDecimalText,
  sanitizeMaxDecimalText,
} from 'lib/utils'

import { ISetAmountComponent } from './SetAmountComponent'
import { BitcoinSetAmountPresentation } from './BitcoinSetAmountPresentation'
import { usePaymentExecutorContext } from './usePaymentExecutor'

interface BitcoinSetAmountContainerProps {
  setAmount: ISetAmountComponent['setAmount']
  token: BitcoinNetwork
  usdAmount: number | undefined
  BitcoinSetAmountComponent?: React.FunctionComponent<{
    amountToPay: string
    handleAmountChange: (value: string, swap: boolean) => void
    utxos?: UnspentTransactionType[]
  }>
}

export const BitcoinSetAmountContainer = ({
  setAmount,
  token,
  usdAmount,
  BitcoinSetAmountComponent = BitcoinSetAmountPresentation,
}: BitcoinSetAmountContainerProps) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [btcToPay, setAmountToPay] = useState<string>('')
  const [usdToPay, setUsdToPay] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { setUtxosGlobal, setBitcoinBalanceGlobal } =
    usePaymentExecutorContext()

  const fetchUtxo = useCallback(async () => {
    token.bips[0].fetchUtxos().then((data: Array<UnspentTransactionType>) => {
      const filtered = data.filter(tx => tx.confirmations > 0)
      setUtxos(filtered)
      setUtxosGlobal(filtered)
    })
  }, [setUtxosGlobal, token.bips])

  const satoshisToPay = useMemo(() => convertBtcToSatoshi(btcToPay), [btcToPay])

  const balanceAvailable = useMemo(
    () =>
      utxos.reduce((prev, utxo) => {
        prev = prev.add(BigNumber.from(utxo.value))
        return prev
      }, BigNumber.from(0)),
    [utxos],
  )

  useEffect(() => {
    setBitcoinBalanceGlobal(balanceAvailable.toNumber())
  }, [balanceAvailable, setBitcoinBalanceGlobal])

  useEffect(() => {
    fetchUtxo()
  }, [fetchUtxo])

  const handleAmountChange = useCallback(
    (amount: string, swap: boolean) => {
      setError('')
      const amountSanitized = sanitizeMaxDecimalText(
        sanitizeDecimalText(amount),
      )

      let amountToTransfer = 0
      if (swap) {
        setUsdToPay(amountSanitized)
        const tokenConversion =
          '' + convertUSDtoToken(Number(amountSanitized), usdAmount || 0, true)
        setAmountToPay(tokenConversion)
        amountToTransfer = Number(tokenConversion)
      } else {
        setUsdToPay(
          '' +
            convertTokenToUSD(
              Number(amountSanitized) || 0,
              usdAmount || 0,
              true,
            ),
        )
        amountToTransfer = Number(amountSanitized)
      }

      const { message } = validateAmount(
        convertBtcToSatoshi('' + amountToTransfer),
        balanceAvailable,
      )
      if (message) {
        setError(message)
      }
    },
    [balanceAvailable, usdAmount],
  )

  // When amount to pay changes - update setAmount
  useEffect(() => {
    setAmount(
      satoshisToPay.toString(),
      validateAmount(satoshisToPay, balanceAvailable).isValid,
    )
  }, [btcToPay, satoshisToPay, balanceAvailable, setAmount])

  const balanceAvailableString = useMemo(
    () => convertSatoshiToBtcHuman(balanceAvailable),
    [balanceAvailable],
  )

  return (
    <BitcoinSetAmountComponent
      utxos={utxos}
      amountToPay={btcToPay}
      usdToPay={usdToPay}
      usdAmount={usdAmount}
      handleAmountChange={handleAmountChange}
      symbol={token.symbol}
      error={error}
      available={balanceAvailableString}
    />
  )
}
