import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WhiteTransparentButton } from '../../components/button/ButtonVariations'
import ExchangeIcon from '../../components/icons/ExchangeIcon'
import ReceiveIcon from '../../components/icons/ReceiveIcon'
import SendIcon from '../../components/icons/SendIcon'
import { grid } from '../../styles/grid'

interface Interface {
  color: string
  sendDisabled: boolean
  onPress: (decision: 'SEND' | 'RECEIVE' | 'FAUCET') => void
}

const SendReceiveButtonComponent: React.FC<Interface> = ({
  onPress,
  color,
  sendDisabled,
}) => {
  const sharedIconProps = {
    width: 25,
    height: 25,
    color,
  }

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <WhiteTransparentButton
          accessibilityLabel="receive"
          icon={<ReceiveIcon {...sharedIconProps} />}
          onPress={() => onPress('RECEIVE')}
        />
      </View>
      <View style={styles.column}>
        <WhiteTransparentButton
          accessibilityLabel="send"
          icon={<SendIcon {...sharedIconProps} />}
          onPress={() => onPress('SEND')}
          disabled={sendDisabled}
        />
      </View>
      <View style={styles.column}>
        <WhiteTransparentButton
          accessibilityLabel="faucet"
          icon={<ExchangeIcon {...sharedIconProps} />}
          onPress={() => onPress('FAUCET')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    ...grid.row,
    marginBottom: 20,
  },
  column: {
    ...grid.column4,
    paddingHorizontal: '1%',
  },
})

export default SendReceiveButtonComponent
