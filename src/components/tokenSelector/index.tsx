import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from '../button'
import { IToken } from '../../lib/token/BaseToken'

import { sharedStyles } from '../../ux/requestsModal/sharedStyles'
import { ModalHeader } from '../index'

interface Interface {
  availableTokens: IToken[]
  onTokenSelection: (token: string) => void
}

const TokenSelector: React.FC<Interface> = ({
  availableTokens,
  onTokenSelection,
}) => {
  return (
    <ScrollView>
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>Select Token</ModalHeader>

        {availableTokens.map((token: any) => (
          <View key={token.symbol}>
            <Button
              onPress={() => onTokenSelection(token.symbol)}
              title={token.symbol}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default TokenSelector