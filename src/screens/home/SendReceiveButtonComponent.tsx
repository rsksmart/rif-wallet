import React from 'react'
import { StyleSheet, View } from 'react-native'
import { WhiteTransparentButton } from 'src/components/button/WhiteButton'
import ExchangeIcon from 'src/components/icons/ExchangeIcon'
import ReceiveIcon from 'src/components/icons/ReceiveIcon'
import SendIcon from 'src/components/icons/SendIcon'
import { grid } from 'src/styles/grid'

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
