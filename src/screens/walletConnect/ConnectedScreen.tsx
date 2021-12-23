import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { Paragraph } from '../../components/typography'

import { NavigationProp, ParamListBase } from '@react-navigation/core'
import { WalletConnectContext } from './WalletConnectContext'
import { Button } from '../../components'
interface IConnectedScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ConnectedScreen: React.FC<IConnectedScreenProps> = ({ navigation }) => {
  const { connector, peerMeta } = useContext(WalletConnectContext)

  const handleDisconnect = async () => {
    if (!connector) {
      return
    }

    connector.killSession({ message: 'user killed the session' })

    navigation.navigate('Home')
  }

  return (
    <ScrollView>
      <View style={styles.roundedContainer}>
        <Text style={styles.heading}>Connected to:</Text>

        <View style={styles.section}>
          <Text style={styles.header}>{peerMeta?.name}</Text>
          <Paragraph>{peerMeta?.description}</Paragraph>
        </View>
        <View style={styles.section2}>
          <Paragraph>{peerMeta?.url}</Paragraph>
        </View>
        <View style={styles.buttonsSection}>
          <Button
            title="Disconnect"
            onPress={() => {
              handleDisconnect()
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    color: '#66777E',
    paddingBottom: 15,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonsSection: {
    width: '100%',
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    height: 200,
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  roundedContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .8)',
    marginVertical: 40,
    padding: 20,
    borderRadius: 20,
    margin: 20,
  },
})

export default ConnectedScreen
