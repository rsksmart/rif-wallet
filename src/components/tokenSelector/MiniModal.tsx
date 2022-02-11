import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import TokenSelector from './index'
import { sharedStyles } from '../../ux/requestsModal/sharedStyles'
import { setOpacity } from '../../screens/home/tokenColor'

interface Props {
  availableTokens: ITokenWithBalance[]
  onTokenSelection: (selectedToken: ITokenWithBalance) => void
}

const MiniModal: React.FC<Props> = ({ availableTokens, onTokenSelection }) => {
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
