import React from 'react'
import { RegularText } from 'src/components'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import SetAmountComponent, { ISetAmountComponent } from './SetAmountComponent'
import { sharedStyles as styles } from './sharedStyles'

export const SetAmountRifComponent: React.FC<ISetAmountComponent> = ({
  setAmount,
  token,
  usdAmount,
}) => (
  <>
    <RegularText style={styles.label}>amount</RegularText>
    <SetAmountComponent
      setAmount={setAmount}
      token={token as ITokenWithBalance}
      usdAmount={usdAmount}
    />
  </>
)
