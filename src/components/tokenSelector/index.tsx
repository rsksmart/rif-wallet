import React from 'react'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { ScrollView, View } from 'react-native'
import { Button } from '../button'
import { IToken } from '../../lib/token/BaseToken'

import { sharedStyles } from '../../ux/requestsModal/sharedStyles'
import { ModalHeader } from '../index'
import { balanceToString } from '../../screens/balances/BalancesScreen'
import { TokenImage } from '../../screens/home/TokenImage'

interface Interface {
  availableTokens: IToken[]
  onTokenSelection: (token: string) => void
}

const TokenSelector: React.FC<Interface> = ({
  availableTokens,
  onTokenSelection,
}) => {
  const {
    state: { balances },
  } = useSocketsState()

  return (
    <ScrollView>
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>Select Token</ModalHeader>

        {availableTokens.map((token: IToken) => {
          const balance = balanceToString(
            balances[token.address].balance,
            balances[token.address].decimals,
          )
          const Icon = <TokenImage symbol={balances[token.address].symbol} />
          return (
            <View key={token.symbol}>
              <Button
                onPress={() => onTokenSelection(token.symbol)}
                title={token.symbol}
                balance={balance}
                icon={<TokenImage symbol={balances[token.address].symbol} />}
              />
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default TokenSelector
