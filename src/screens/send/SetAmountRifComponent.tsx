import { useCallback, useEffect, useState } from 'react'
import { TokenBalance } from 'src/components/token'
import { CurrencyValue } from 'src/components/token/TokenBalance'
import {
  convertTokenToUSD,
  convertUSDtoToken,
  sanitizeDecimalText,
} from 'src/lib/utils'
import { sharedColors } from 'src/shared/constants'
import { ISetAmountComponent } from './SetAmountComponent'

export const SetAmountRifComponent = ({
  setAmount,
  token,
  usdAmount,
}: ISetAmountComponent) => {
  const [firstValue, setFirstValue] = useState<CurrencyValue>({
    balance: '',
    symbol: token.symbol,
    symbolType: 'icon',
  })
  const [secondValue, setSecondValue] = useState<CurrencyValue>({
    balance: '0.00',
    symbol: '$',
    symbolType: 'text',
  })

  useEffect(() => {
    const icon = { symbol: token.symbol, symbolType: 'icon' }
    const text = { symbol: '$', symbolType: 'text' }
    setFirstValue(fv => {
      if (fv.symbolType === 'icon') {
        return { ...icon, ...{ balance: '' } }
      } else {
        return { ...text, ...{ balance: '' } }
      }
    })

    setSecondValue(sv => {
      if (sv.symbolType === 'text') {
        return { ...text, ...{ balance: '0.00' } }
      } else {
        return { ...icon, ...{ balance: '0.00' } }
      }
    })
  }, [token.symbol])

  const onSwap = () => {
    const swap = { ...firstValue }
    if (firstValue.balance === '') {
      setFirstValue({ ...secondValue, ...{ balance: '' } })
      setSecondValue({ ...swap, ...{ balance: '0.00' } })
    } else {
      setFirstValue(secondValue)
      setSecondValue(swap)
    }
  }
  const handleAmountChange = useCallback(
    (text: string) => {
      const amountText = sanitizeDecimalText(text)
      const amountToTransfer = Number(amountText)
      setFirstValue({ ...firstValue, ...{ balance: amountText } })
      if (firstValue.symbol === token.symbol) {
        setAmount(amountText, true)
        setSecondValue({
          ...secondValue,
          ...{
            balance:
              '' + convertTokenToUSD(amountToTransfer, usdAmount || 0, true),
          },
        })
      } else {
        const newBalance = convertUSDtoToken(
          amountToTransfer,
          usdAmount || 0,
          true,
        )
        setSecondValue({ ...secondValue, ...{ balance: '' + newBalance } })
        setAmount('' + newBalance, true)
      }
    },
    [firstValue, secondValue, setAmount, token.symbol, usdAmount],
  )
  return (
    <>
      <TokenBalance
        firstValue={firstValue}
        secondValue={secondValue}
        editable={true}
        onSwap={onSwap}
        color={sharedColors.tokenBackground}
        handleAmountChange={handleAmountChange}
      />
    </>
  )
}
