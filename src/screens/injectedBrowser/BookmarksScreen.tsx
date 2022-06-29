import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Header3, Paragraph } from '../../components'
import { IRegisteredDappsGroup } from 'rif-wallet/packages/types'
import { ScreenWithWallet } from '../types'
import { InjectedBrowserUXScreenProps } from './InjectedBrowserNavigation'

import { ScreenProps, StackParamList } from './types'

export const BookmarksScreen: React.FC<
  ScreenProps<'Bookmarks'> & ScreenWithWallet & InjectedBrowserUXScreenProps
> = ({ navigation, fetcher, wallet }) => {
  const [dappsGroups, setDappsGroups] = useState<
    IRegisteredDappsGroup[] | null
  >(null)

  const [chainId, setChainId] = useState<number>(0)

  useEffect(() => {
    const action = async () => {
      const groupsResult = await fetcher.fetchDapps()
      const chainIdResult = await wallet.provider?.getNetwork()

      setDappsGroups(groupsResult)
      setChainId(chainIdResult?.chainId ?? 0)
    }

    action()
  }, [fetcher])

  return (
    <ScrollView>
      {!dappsGroups && <Paragraph>Loading...</Paragraph>}
      {dappsGroups &&
        dappsGroups.map((group, index) => (
          <DappsGroup
            key={`dapps-group-${index}`}
            group={group}
            navigation={navigation}
            chainId={chainId}
          />
        ))}
    </ScrollView>
  )
}

const DappsGroup: React.FC<{
  group: IRegisteredDappsGroup
  navigation: StackNavigationProp<StackParamList, 'Bookmarks'>
  chainId: number
}> = ({ group, navigation, chainId }) => {
  const dapps = group.dapps.filter(
    x => x.allowedNetworks.length === 0 || x.allowedNetworks.includes(chainId),
  )

  if (dapps.length === 0) {
    return null
  }

  return (
    <View style={styles.section}>
      <Header3>{group.groupName}</Header3>
      {dapps.map((dapp, index) => (
        <Button
          key={`dapps-button-${index}`}
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: dapp.url,
            })
          }
          title={dapp.title}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  bottomPadding: {
    paddingBottom: 30,
  },
})
