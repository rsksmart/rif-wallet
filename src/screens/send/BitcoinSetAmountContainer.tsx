import React, { useState } from 'react'
import { UnspentTransactionType } from '../../lib/bitcoin/types'
import {
  convertBtcToSatoshi,
  convertSatoshiToBtcHuman,
  validateAmount,
} from '../../lib/bitcoin/utils'
import { BigNumber } from 'ethers'
import { sanitizeDecimalText, sanitizeMaxDecimalText } from '../../lib/utils'
import { ISetAmountComponent } from './SetAmountComponent'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
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

export const BitcoinSetAmountContainer: React.FC<
  IBitcoinSetAmountContainer
> = ({
  setAmount,
  token,
  BitcoinSetAmountComponent = BitcoinSetAmountPresentation,
}) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [amountToPay, setAmountToPay] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { setUtxosGlobal, setBitcoinBalanceGlobal } =
    usePaymentExecutorContext()

  const fetchUtxo = async () => {
    token.bips[0].fetchUtxos().then((data: Array<UnspentTransactionType>) => {
      const filtered = data.filter(tx => tx.confirmations > 0)
      setUtxos(filtered)
      setUtxosGlobal(filtered)
    })
  }

  const satoshisToPay = React.useMemo(
    () => convertBtcToSatoshi(amountToPay),
    [amountToPay],
  )

  const balanceAvailable = React.useMemo(
    () =>
      utxos.reduce((prev, utxo) => {
        prev = prev.add(BigNumber.from(utxo.value))
        return prev
      }, BigNumber.from(0)),
    [utxos],
  )

  React.useEffect(() => {
    setBitcoinBalanceGlobal(balanceAvailable.toNumber())
  }, [balanceAvailable])
  React.useEffect(() => {
    fetchUtxo()
  }, [])
  const handleAmountChange = React.useCallback(
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
  React.useEffect(() => {
    setAmount(
      satoshisToPay.toString(),
      validateAmount(satoshisToPay, balanceAvailable).isValid,
    )
  }, [amountToPay])

  const balanceAvailableString = React.useMemo(
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
