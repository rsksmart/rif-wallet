import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import LinearGradient from 'react-native-linear-gradient'
import WalletConnectComponent from './WalletConnectComponent'
import InjectedBrowserComponent from './InjectedBrowserComponent'
import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { ScreenWithWallet } from '../types'

type TPanelOptions = 'WalletConnect' | 'InjectedBrowser'

export type DappsScreenScreenProps = {
  fetcher: IRIFWalletServicesFetcher
}

export const DappsScreen: React.FC<
  {
    navigation: NavigationProp
  } & DappsScreenScreenProps &
    ScreenWithWallet
> = ({ navigation, wallet, isWalletDeployed, fetcher }) => {
  const [selectedPanel, setSelectedPanel] =
    useState<TPanelOptions>('WalletConnect')

  return (
    <LinearGradient
      colors={['#FFFFFF', 'rgba(55, 63, 72, 0.3)']}
      style={styles.parent}>
      <LinearGradient
        colors={[
          '#FFFFFF',
          selectedPanel === 'InjectedBrowser' ? '#fff' : '#E1E1E1',
        ]}
        style={styles.topContainer}>
        <WalletConnectComponent
          navigation={navigation}
          visible={selectedPanel === 'WalletConnect'}
          setPanelActive={() => setSelectedPanel('WalletConnect')}
        />
        <InjectedBrowserComponent
          navigation={navigation}
          isWalletDeployed={isWalletDeployed}
          wallet={wallet}
          fetcher={fetcher}
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
    shadowColor: 'rgba(204, 204, 204, 0.5)',
  },
})
