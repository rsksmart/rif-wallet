import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

import { UnspentTransactionType } from 'lib/bitcoin/types'
import {
  convertBtcToSatoshi,
  convertSatoshiToBtcHuman,
  validateAmount,
} from 'lib/bitcoin/utils'
import { sanitizeDecimalText, sanitizeMaxDecimalText } from 'lib/utils'
import BitcoinNetwork from 'lib/bitcoin/BitcoinNetwork'

import { ISetAmountComponent } from './SetAmountComponent'
import { BitcoinSetAmountPresentation } from './BitcoinSetAmountPresentation'
import { usePaymentExecutorContext } from './usePaymentExecutor'

interface IBitcoinSetAmountContainer {
  setAmount: ISetAmountComponent['setAmount']
  token: BitcoinNetwork
  BitcoinSetAmountComponent?: React.FunctionComponent<{
    amountToPay: string
    handleAmountChange: (value: string) => void
    utxos?: UnspentTransactionType[]
  }>
}

export const BitcoinSetAmountContainer = ({
  setAmount,
  token,
  BitcoinSetAmountComponent = BitcoinSetAmountPresentation,
}: IBitcoinSetAmountContainer) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [amountToPay, setAmountToPay] = useState<string>('')
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

  const satoshisToPay = useMemo(
    () => convertBtcToSatoshi(amountToPay),
    [amountToPay],
  )

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
    (amount: string) => {
      setError('')
      const amountSanitized = sanitizeMaxDecimalText(
        sanitizeDecimalText(amount),
      )

      const { message } = validateAmount(
        convertBtcToSatoshi(amountSanitized),
        balanceAvailable,
      )
      setAmountToPay(amountSanitized)
      if (message) {
        setError(message)
      }
    },
    [balanceAvailable],
  )

  // When amount to pay changes - update setAmount
  useEffect(() => {
    setAmount(
      satoshisToPay.toString(),
      validateAmount(satoshisToPay, balanceAvailable).isValid,
    )
  }, [amountToPay, balanceAvailable, satoshisToPay, setAmount])

  const balanceAvailableString = useMemo(
    () => convertSatoshiToBtcHuman(balanceAvailable),
    [balanceAvailable],
  )

  return (
    <BitcoinSetAmountComponent
      utxos={utxos}
      amountToPay={amountToPay}
      handleAmountChange={handleAmountChange}
      error={error}
      available={balanceAvailableString}
    />
  )
}
