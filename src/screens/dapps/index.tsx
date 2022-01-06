import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import { setOpacity } from '../home/tokenColor'
import LinearGradient from 'react-native-linear-gradient'
import WalletConnectComponent from './WalletConnectComponent'
import InjectedBrowserComponent from './InjectedBrowserComponent'

type TPanelOptions = 'WalletConnect' | 'InjectedBrowser'

export const DappsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const [selectedPanel, setSelectedPanel] =
    useState<TPanelOptions>('WalletConnect')

  return (
    <LinearGradient
      colors={['#f4f4f4', setOpacity('#373f48', 0.3)]}
      style={styles.parent}>
      <LinearGradient
        colors={['#FFFFFF', '#E1E1E1']}
        style={styles.topContainer}>
        <WalletConnectComponent
          navigation={navigation}
          visible={selectedPanel === 'WalletConnect'}
          setPanelActive={() => setSelectedPanel('WalletConnect')}
        />
        <InjectedBrowserComponent
          visible={selectedPanel === 'InjectedBrowser'}
          setPanelActive={() => setSelectedPanel('InjectedBrowser')}
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
    // shadowRadius: 10,
    elevation: 2,
    shadowColor: setOpacity('#CCCCCC', 0.5),
  },
})
