import { StyleSheet, View, ScrollView } from 'react-native'
import { Trans } from 'react-i18next'

import { KeyManagementSystem } from 'lib/core'

import { CopyComponent, MediumText, RegularText } from 'components/index'
import { getKeys } from 'storage/SecureStorage'
import { useEffect, useState } from 'react'

export enum TestID {
  Mnemonic = 'Mnemonic.Text',
}

export const ShowMnemonicScreen = () => {
  const [mnemonic, setMnemonic] = useState<string | null>()

  useEffect(() => {
    const fn = async () => {
      const keys = await getKeys()
      if (keys) {
        const { kms } = KeyManagementSystem.fromSerialized(keys.password)
        setMnemonic(kms.mnemonic)
      }
    }

    fn()
  }, [])

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <RegularText>
          <Trans>
            With your master key (seed phrase) you are able to create as many
            wallets as you need.
          </Trans>
        </RegularText>
      </View>
      <View style={styles.section}>
        <MediumText>
          <Trans>Master key</Trans>
        </MediumText>
        <CopyComponent testID={TestID.Mnemonic} value={mnemonic || ''} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
