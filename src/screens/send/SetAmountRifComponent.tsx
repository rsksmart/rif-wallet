import { Text } from 'react-native'
import SetAmountComponent, { ISetAmountComponent } from './SetAmountComponent'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import React from 'react'
import { sharedStyles as styles } from './sharedStyles'

export const SetAmountRifComponent: React.FC<ISetAmountComponent> = ({
  setAmount,
  token,
  usdAmount,
}) => (
  <>
    <Text style={styles.label}>amount</Text>
    <SetAmountComponent
      setAmount={setAmount}
      token={token as ITokenWithBalance}
      usdAmount={usdAmount}
    />
  </>
)
