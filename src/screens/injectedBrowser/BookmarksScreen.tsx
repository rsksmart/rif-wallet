import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Header3, Paragraph } from '../../components'
import {
  IRegisteredDappsGroup,
  RifWalletServicesFetcher,
} from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { ScreenProps, StackParamList } from './types'

const fetcher = new RifWalletServicesFetcher()

export const BookmarksScreen: React.FC<ScreenProps<'Bookmarks'>> = ({
  navigation,
}) => {
  const [dappsGroups, setDappsGroups] = useState<
    IRegisteredDappsGroup[] | null
  >(null)

  useEffect(() => {
    fetcher.fetchDapps().then(setDappsGroups)
  }, [])

  return (
    <ScrollView>
      {!dappsGroups && <Paragraph>Loading...</Paragraph>}
      {dappsGroups &&
        dappsGroups.map((group, index) => (
          <DappsGroup
            key={`dapps-group-${index}`}
            group={group}
            navigation={navigation}
          />
        ))}
    </ScrollView>
  )
}

const DappsGroup: React.FC<{
  group: IRegisteredDappsGroup
  navigation: StackNavigationProp<StackParamList, 'Bookmarks'>
}> = ({ group, navigation }) => {
  if (group.dapps.length === 0) {
    return null
  }

  return (
    <View style={styles.section}>
      <Header3>{group.groupName}</Header3>
      {group.dapps.map((dapp, index) => (
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
