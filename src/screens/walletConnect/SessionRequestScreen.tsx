import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { Paragraph } from '../../components/typography'

import { NavigationProp, ParamListBase } from '@react-navigation/core'
import { WalletConnectContext } from './WalletConnectContext'
import { Button } from '../../components'
import { useSelectedWallet } from '../../Context'

interface ISessionRequestScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const SessionRequestScreen: React.FC<ISessionRequestScreenProps> = ({
  route,
}) => {
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)

  const { wallet } = useSelectedWallet()

  const { connector } = connections[route.params?.wcKey]

  return (
    <ScrollView>
      <View style={styles.roundedContainer}>
        <Text style={styles.heading}>Connect to:</Text>
        <View style={styles.section}>
          <Text style={styles.header}>{connector.peerMeta?.name}</Text>
          <Paragraph>{connector.peerMeta?.description}</Paragraph>
        </View>
        <View style={styles.section2}>
          <Paragraph>{connector.peerMeta?.url}</Paragraph>
        </View>
        <View style={styles.buttonsSection}>
          <Button
            title="Reject"
            onPress={() => {
              handleReject(connector)
            }}
          />
          <Button
            title="Approve"
            onPress={() => {
              handleApprove(connector, wallet)
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

export default SessionRequestScreen
