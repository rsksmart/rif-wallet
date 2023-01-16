import { StyleSheet, View, ScrollView } from 'react-native'
import { Trans } from 'react-i18next'

import { CopyComponent, MediumText, RegularText } from '../../components'
import { useAppSelector } from 'store/storeUtils'
import { selectKMS } from 'store/slices/settingsSlice'
export enum TestID {
  Mnemonic = 'Mnemonic.Text',
}

export const ShowMnemonicScreen = () => {
  const kms = useAppSelector(selectKMS)

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
        <CopyComponent testID={TestID.Mnemonic} value={kms?.mnemonic || ''} />
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
