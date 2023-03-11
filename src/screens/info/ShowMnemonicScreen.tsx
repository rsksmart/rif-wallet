import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Trans } from 'react-i18next'

import { KeyManagementSystem } from 'lib/core'

import { MediumText, RegularText } from 'components/index'
import { MnemonicComponent } from 'components/mnemonic'
import { getKeys } from 'storage/SecureStorage'
import { castStyle } from 'shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'

export enum TestID {
  Mnemonic = 'Mnemonic.Text',
}

export const ShowMnemonicScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.ShowMnemonicScreen>) => {
  const [mnemonic, setMnemonic] = useState<string | null>()
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])
  useEffect(() => {
    const fn = async () => {
      const keys = await getKeys()
      if (keys) {
        const { kms } = KeyManagementSystem.fromSerialized(keys)
        setMnemonic(kms.mnemonic)
      }
    }

    fn()
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.sectionCentered}>
        <RegularText>
          <Trans>
            With your master key (seed phrase) you are able to create as many
            wallets as you need.
          </Trans>
        </RegularText>
      </View>
      <MediumText>
        <Trans>Master key</Trans>
      </MediumText>
      {mnemonic ? <MnemonicComponent words={mnemonic.split(' ')} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    paddingHorizontal: 24,
  }),
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})
