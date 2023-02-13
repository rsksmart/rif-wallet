import React from 'react'
import { TokenBalance } from 'src/components/token'
import { sharedColors } from 'src/shared/constants'
import { ISetAmountComponent } from './SetAmountComponent'

export const SetAmountRifComponent: React.FC<ISetAmountComponent> = ({
  setAmount,
  token,
  usdAmount,
}) => (
  <>
    <TokenBalance
      color={sharedColors.tokenBackground}
      token={{ ...token, ...{ price: usdAmount || 0 } }}
      editable={true}
      setAmount={setAmount}
    />
  </>
)
