import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WhiteTransparentButton } from '../../components/button/ButtonVariations'
import ExchangeIcon from '../../components/icons/ExchangeIcon'
import ReceiveIcon from '../../components/icons/ReceiveIcon'
import SendIcon from '../../components/icons/SendIcon'
import { grid } from '../../styles/grid'

interface Interface {
  color: string
  onPress: (decision: 'SEND' | 'RECEIVE' | 'FAUCET') => void
}

const SendReceiveButtonComponent: React.FC<Interface> = ({
  onPress,
  color,
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
          icon={<ReceiveIcon {...sharedIconProps} />}
          onPress={() => onPress('RECEIVE')}
        />
      </View>
      <View style={styles.column}>
        <WhiteTransparentButton
          icon={<SendIcon {...sharedIconProps} />}
          onPress={() => onPress('SEND')}
        />
      </View>
      <View style={styles.column}>
        <WhiteTransparentButton
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
