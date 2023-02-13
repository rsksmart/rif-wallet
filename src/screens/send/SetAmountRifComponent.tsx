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
  const [firstVal, setFirstVal] = useState<CurrencyValue>({
    balance: '',
    symbol: token.symbol,
    symbolType: 'icon',
  })
  const [secondVal, setSecondVal] = useState<CurrencyValue>({
    balance: '0.00',
    symbol: '$',
    symbolType: 'text',
  })

  useEffect(() => {
    const icon = { symbol: token.symbol, symbolType: 'icon' }
    const text = { symbol: '$', symbolType: 'text' }
    setFirstVal(fv => {
      if (fv.symbolType === 'icon') {
        return { ...icon, ...{ balance: '' } }
      } else {
        return { ...text, ...{ balance: '' } }
      }
    })

    setSecondVal(sv => {
      if (sv.symbolType === 'text') {
        return { ...text, ...{ balance: '0.00' } }
      } else {
        return { ...icon, ...{ balance: '0.00' } }
      }
    })
  }, [token.symbol])

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
  const handleAmountChange = useCallback(
    (text: string) => {
      const amountText = sanitizeDecimalText(text)
      const amountToTransfer = Number(amountText)
      setFirstVal({ ...firstVal, ...{ balance: amountText } })
      if (firstVal.symbol === token.symbol) {
        setAmount(amountText, true)
        setSecondVal({
          ...secondVal,
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
        setSecondVal({ ...secondVal, ...{ balance: '' + newBalance } })
        setAmount('' + newBalance, true)
      }
    },
    [firstVal, secondVal, setAmount, token.symbol, usdAmount],
  )
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
    </>
  )
}
