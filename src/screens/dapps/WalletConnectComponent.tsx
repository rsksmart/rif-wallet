import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, QRCodeIcon } from '../../components/icons'
import { NavigationProp } from '../../RootNavigation'
import { WalletConnectContext } from '../walletConnect/WalletConnectContext'

interface Interface {
  navigation: NavigationProp
  visible: boolean
  setPanelActive: () => void
}

const WalletConnectComponent: React.FC<Interface> = ({
  navigation,
  visible,
  setPanelActive,
}) => {
  const { isConnected, peerMeta } = useContext(WalletConnectContext)

  return (
    <View style={visible ? styles.roundedBox : styles.roundedBoxNotVisible}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>Connect Dapps</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.row}>
          <View>
            {!isConnected && <Text>Connect to dapps</Text>}
            {isConnected && (
              <Text style={{ maxWidth: '80%', flexWrap: 'wrap' }}>
                Connected to: {peerMeta?.name}
              </Text>
            )}
            <Text>via Wallet Connect</Text>
          </View>
          <SquareButton
            color={'#000'}
            onPress={() => {
              navigation.navigate('WalletConnect')
            }}
            title={isConnected ? 'details' : 'connect'}
            icon={
              isConnected ? (
                <Arrow color={'#000'} rotate={90} />
              ) : (
                <QRCodeIcon color={'#000'} />
              )
            }
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 15,
    fontSize: 16,
    color: '#66777E',
  },
  roundedBox: {
    paddingHorizontal: 25,
    borderRadius: 25,
    paddingBottom: 20,
  },
  roundedBoxNotVisible: {
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default WalletConnectComponent
