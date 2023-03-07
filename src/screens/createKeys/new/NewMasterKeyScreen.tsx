import { CompositeScreenProps } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { KeyManagementSystem } from 'lib/core'

import { AppButton, Typography, MnemonicComponent } from 'components/index'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.NewMasterKey>,
  RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
>

export const NewMasterKeyScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()
  const mnemonic = useMemo(() => KeyManagementSystem.create().mnemonic, [])
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false)

  return (
    <View style={styles.screen}>
      <Typography style={styles.titleText} type={'h2'}>
        {t('new_master_key_title')}
      </Typography>
      <MnemonicComponent
        style={styles.mnemonicComponent}
        onToggleMnemonic={setIsMnemonicVisible}
        words={mnemonicArray}
      />
      <AppButton
        title={t('new_master_key_button_title')}
        disabled={!isMnemonicVisible}
        style={styles.button}
        color={sharedColors.white}
        textColor={sharedColors.black}
        textType={'h4'}
        onPress={() =>
          navigation.navigate(createKeysRouteNames.ConfirmNewMasterKey, {
            mnemonic,
          })
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.black,
    paddingHorizontal: 24,
  }),
  titleText: castStyle.text({
    marginTop: 58,
  }),
  mnemonicComponent: castStyle.view({
    marginTop: 30,
  }),
  button: castStyle.view({
    position: 'absolute',
    bottom: 22,
    left: 24,
    right: 24,
  }),
})
