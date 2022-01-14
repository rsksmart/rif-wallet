import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import { IToken } from '../../lib/token/BaseToken'

import TokenSelector from '../TokenSelector/TokenSelector'
import { sharedStyles } from '../../ux/requestsModal/sharedStyles'
import { setOpacity } from '../../screens/home/tokenColor'

interface Interface {
  availableTokens: IToken[]
  onTokenSelection: (selectedToken: string) => void
}

const MiniModal: React.FC<Interface> = ({
  availableTokens,
  onTokenSelection,
}) => {
  return (
    <View style={sharedStyles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={[sharedStyles.centeredView, styles.blurBackground]}>
          <View style={sharedStyles.modalView}>
            <TokenSelector
              availableTokens={availableTokens}
              onTokenSelection={onTokenSelection}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default MiniModal

const styles = StyleSheet.create({
  blurBackground: {
    marginTop: 0,
    backgroundColor: setOpacity('#373f48', 0.88),
  },
})
