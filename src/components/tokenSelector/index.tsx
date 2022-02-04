import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from '../button'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { sharedStyles } from '../../ux/requestsModal/sharedStyles'
import { ModalHeader } from '../index'
import { balanceToString } from '../../screens/balances/BalancesScreen'
import { TokenImage } from '../../screens/home/TokenImage'

interface Interface {
  availableTokens: ITokenWithBalance[]
  onTokenSelection: (token: ITokenWithBalance) => void
}

const TokenSelector: React.FC<Interface> = ({
  availableTokens,
  onTokenSelection,
}) => {
  return (
    <ScrollView>
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>Select Token</ModalHeader>

        {availableTokens.map((token: ITokenWithBalance) => {
          const balance = balanceToString(token.balance, token.decimals)
          return (
            <View key={token.symbol}>
              <Button
                onPress={() => onTokenSelection(token)}
                title={token.symbol}
                balance={balance}
                icon={<TokenImage symbol={token.symbol} />}
              />
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default TokenSelector
