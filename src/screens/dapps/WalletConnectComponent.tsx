import WalletConnect from '@walletconnect/client'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, QRCodeIcon } from '../../components/icons'
import { Separator } from '../../components/separator'
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
  const { connections } = useContext(WalletConnectContext)

  const openedConnections = Object.values(connections).filter(
    x => x.connector.connected,
  )

  return (
    <View style={visible ? styles.roundedBox : styles.roundedBoxNotVisible}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>Connect Dapps</Text>
      </TouchableOpacity>
      {visible && (
        <>
          <NewConnection navigation={navigation} />
          {openedConnections.map(({ connector }) => (
            <React.Fragment key={connector.key}>
              <Separator />
              <DappConnected connector={connector} navigation={navigation} />
            </React.Fragment>
          ))}
        </>
      )}
    </View>
  )
}

const DappConnected: React.FC<{
  connector: WalletConnect
  navigation: NavigationProp
}> = ({ connector, navigation }) => {
  const { peerMeta, key: wcKey } = connector

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.connectedTo}>Connected to: {peerMeta?.name}</Text>
        <Text>via Wallet Connect</Text>
      </View>
      <SquareButton
        shadowColor={'#000'}
        onPress={() => {
          navigation.navigate('WalletConnect', {
            screen: 'Connected',
            params: {
              wcKey: wcKey,
            },
          } as never)
        }}
        title={'details'}
        icon={<Arrow color={'#000'} rotate={90} />}
      />
    </View>
  )
}

const NewConnection: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  return (
    <View style={styles.row}>
      <View>
        <Text>Connect to dapps</Text>
        <Text>via Wallet Connect</Text>
      </View>
      <SquareButton
        shadowColor={'#000'}
        onPress={() => navigation.navigate('WalletConnect')}
        title={'connect'}
        icon={<QRCodeIcon color={'#000'} />}
      />
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
  connectedTo: {
    maxWidth: '80%',
    flexWrap: 'wrap',
  },
})

export default WalletConnectComponent
