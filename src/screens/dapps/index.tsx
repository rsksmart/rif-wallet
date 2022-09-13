import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { NavigationProp } from '../../RootNavigation'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { ScreenWithWallet } from '../types'

export type DappsScreenScreenProps = {
  fetcher: IRIFWalletServicesFetcher
}

export const DappsScreen: React.FC<
  {
    navigation: NavigationProp
  } & DappsScreenScreenProps &
    ScreenWithWallet
> = ({ navigation, wallet, isWalletDeployed, fetcher }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <View style={styles.innerHeader1}>
          <Text style={styles.title}>{t('Connected Dapps')}</Text>
          <Text style={styles.subtitle}>
            {t('Connect new Dapp by scanning a QR code.')}
          </Text>
        </View>
        <View style={styles.innerHeader2} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
  },
  innerHeader1: {
    flex: 3,
  },
  innerHeader2: {
    flex: 2,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text.primary,
  },
})
