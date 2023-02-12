import React from 'react'
import { TokenBalance } from 'src/components/token'
import { ISetAmountComponent } from './SetAmountComponent'

export const SetAmountRifComponent: React.FC<ISetAmountComponent> = ({
  setAmount,
  token,
  usdAmount,
}) => (
  <>
    <TokenBalance
      color={'#1E1E1E'}
      token={{ ...token, ...{ price: usdAmount || 0 } }}
      editable={true}
      setAmount={setAmount}
    />
  </>
)
