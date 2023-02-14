import { useState, useEffect, useMemo, useCallback } from 'react'
import { BigNumber } from 'ethers'
import {
  convertBtcToSatoshi,
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
import { usePaymentExecutorContext } from './usePaymentExecutor'
import { TokenBalance } from 'components/token'
import { sharedColors } from 'shared/constants'
import { CurrencyValue } from 'components/token/TokenBalance'
import { Typography } from 'components/index'

interface BitcoinSetAmountContainerProps {
  setAmount: ISetAmountComponent['setAmount']
  token: BitcoinNetwork
  usdAmount: number | undefined
}

export const BitcoinSetAmountContainer = ({
  setAmount,
  token,
  usdAmount,
}: BitcoinSetAmountContainerProps) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [firstVal, setFirstVal] = useState<CurrencyValue>({
    symbolType: 'icon',
    symbol: token.symbol,
    balance: '',
  })
  const [secondVal, setSecondVal] = useState<CurrencyValue>({
    symbolType: 'text',
    symbol: '$',
    balance: '0.00',
  })
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
      setFirstVal({ ...firstVal, ...{ balance: amountSanitized } })

      let amountToTransfer = 0
      if (firstVal.symbol === token.symbol) {
        amountToTransfer = Number(amountSanitized)
        setAmountToPay(amountSanitized)
        setSecondVal({
          ...secondVal,
          ...{
            balance:
              '' + convertTokenToUSD(amountToTransfer, usdAmount || 0, true),
          },
        })
      } else {
        amountToTransfer = Number(amountSanitized)
        const newBalance = convertUSDtoToken(
          amountToTransfer,
          usdAmount || 0,
          true,
        )
        setAmountToPay('' + newBalance)
        setSecondVal({ ...secondVal, ...{ balance: '' + newBalance } })
      }
      const { message } = validateAmount(
        convertBtcToSatoshi('' + amountToTransfer),
        balanceAvailable,
      )
      if (message) {
        setError(message)
      }
    },
    [balanceAvailable, usdAmount, firstVal, secondVal, token.symbol],
  )

  // When amount to pay changes - update setAmount
  useEffect(() => {
    setAmount(
      satoshisToPay.toString(),
      validateAmount(satoshisToPay, balanceAvailable).isValid,
    )
  }, [amountToPay, satoshisToPay, balanceAvailable, setAmount])

  const onSwap = () => {
    const swap = { ...firstVal }
    if (firstVal.balance === '') {
      setFirstVal({ ...secondVal, ...{ balance: '' } })
      setSecondVal({ ...swap, ...{ balance: '0.00' } })
    } else {
      setFirstVal(secondVal)
      setSecondVal(swap)
    }
  }

  return (
    <>
      <TokenBalance
        firstVal={firstVal}
        secondVal={secondVal}
        editable={true}
        onSwap={onSwap}
        color={sharedColors.tokenBackground}
        handleAmountChange={handleAmountChange}
      />
      {error !== '' && (
        <Typography type={'label'} style={{ color: sharedColors.danger }}>
          {error}
        </Typography>
      )}
    </>
  )
}
