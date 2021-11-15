import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, CopyComponent, Header2, Paragraph } from '../../components'
import { Trans } from 'react-i18next'
export enum TestID {
  Mnemonic = 'Mnemonic.Text',
  Delete = 'Delete.Button',
}

export type KeysInfoScreenProps = {
  mnemonic: string
  deleteKeys: () => Promise<any>
}

export const KeysInfoScreen: React.FC<KeysInfoScreenProps> = ({
  mnemonic,
  deleteKeys,
}) => (
  <ScrollView>
    <View style={styles.sectionCentered}>
      <Paragraph>
        <Trans>
          With your master key (seed phrase) you are able to create as many
          wallets as you need.
        </Trans>
      </Paragraph>
    </View>
    <View style={styles.section}>
      <Header2>
        <Trans>Master key</Trans>
      </Header2>
      <CopyComponent testID={TestID.Mnemonic} value={mnemonic} />
    </View>
    <View style={styles.section}>
      <Button testID={TestID.Delete} onPress={deleteKeys} title="Delete keys" />
      <Paragraph>
        <Trans>You will need to refresh the app for this to fully work.</Trans>
      </Paragraph>
    </View>
  </ScrollView>
)

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
