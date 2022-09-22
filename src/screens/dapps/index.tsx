import React from 'react'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Button } from '../../components'
import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { NavigationProp } from '../../RootNavigation'
import WalletConnectComponent from './WalletConnectComponent'

export type DappsScreenScreenProps = {
  fetcher: IRIFWalletServicesFetcher
}

export const DappsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#FFFFFF', 'rgba(55, 63, 72, 0.3)']}
      style={styles.parent}>
      <LinearGradient
        colors={['#FFFFFF', '#E1E1E1']}
        style={styles.topContainer}>
        <WalletConnectComponent navigation={navigation} />

        <Button
          title="RNS Manager native"
          onPress={() => navigation.navigate('RNSManager')}
        />
      </LinearGradient>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    paddingTop: 20,
  },
  topContainer: {
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
    elevation: 2,
    shadowColor: 'rgba(204, 204, 204, 0.5)',
  },
})
