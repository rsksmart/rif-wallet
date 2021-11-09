import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import { Paragraph } from '../../components/typography'

import { RIFWallet } from '../../lib/core'
import { NavigationProp, ParamListBase } from '@react-navigation/core'
import { WalletConnectContext } from './WalletConnectContext'
import { Button } from '../../components'
interface IConnectedScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ConnectedScreen: React.FC<IConnectedScreenProps> = ({
  route,
  navigation,
}) => {
  const account = route.params.account as RIFWallet
  const peerMeta = route.params.peerMeta

  const { connector } = useContext(WalletConnectContext)

  console.log('peerData', account.address, route.params.peerMeta)

  const handleDisconnect = async () => {
    if (!connector) {
      return
    }

    connector.killSession({ message: 'user killed the session' })

    navigation.navigate('Home')
  }

  return (
    <ScrollView>
      <View style={styles.section2}>
        <Paragraph>Name: </Paragraph>
        <Paragraph>{peerMeta?.name}</Paragraph>
      </View>
      <View style={styles.section2}>
        <Paragraph>Description: </Paragraph>
        <Paragraph>{peerMeta?.description}</Paragraph>
      </View>
      <View style={styles.section2}>
        <Paragraph>Url: </Paragraph>
        <Paragraph>{peerMeta?.url}</Paragraph>
      </View>
      <View style={styles.section2}>
        <Button
          title="Disconnect"
          onPress={() => {
            handleDisconnect()
          }}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    height: 200,
  },
  section: {
    marginTop: 160,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  section2: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})

export default ConnectedScreen
