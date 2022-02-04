import React, { useContext } from 'react'
import { NavigationProp, ScreenProps } from '../../RootNavigation'
import { AppContext } from '../../Context'
import { StyleSheet, ScrollView, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { setOpacity } from '../home/tokenColor'
import { useTranslation } from 'react-i18next'
import { ButtonAlt } from '../../components/button/ButtonAlt'
import { Section } from '../../components/section'

export const SettingsScreen: React.FC<ScreenProps<'Home'>> = ({
  navigation,
}) => {
  const { t } = useTranslation()

  return (
    <LinearGradient
      colors={['#f4f4f4', setOpacity('#373f48', 0.3)]}
      style={styles.parent}>
      <ScrollView>
        <Text style={[styles.header, styles.marginBottom]}>Settings</Text>
        <Section title={t('General')}>
          <ButtonAlt
            onPress={() => navigation.navigate('ChangeLanguage')}
            title={t('Change Language')}
            style={styles.marginBottom}
          />
          <ButtonAlt
            onPress={() => navigation.navigate('DevMenu')}
            title={'DevMenu'}
            style={styles.marginBottom}
          />
        </Section>
        <Section title={t('Accounts')}>
          <ButtonAlt
            onPress={() => navigation.navigate('WalletInfo')}
            title={t('Account Info')}
            style={styles.marginBottom}
          />
        </Section>
        <Section title={t('Security')}>
          <ButtonAlt
            onPress={() => navigation.navigate('ManagePin')}
            title={t('Manage Pin')}
            style={styles.marginBottom}
          />
          <ButtonAlt
            onPress={() => navigation.navigate('KeysInfo')}
            title={t('Reveal master key')}
            style={styles.marginBottom}
          />
        </Section>
        <Section title={t('Information')} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    flex: 1,
    padding: 10,
    paddingTop: 0,
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
    color: '#5c5d5d',
  },
  marginBottom: { marginBottom: 10 },
})

const KeysActionItem = ({
  navigation,
  t,
}: {
  navigation: NavigationProp
  t: any
}) =>
  !useContext(AppContext).mnemonic ? (
    <ButtonAlt
      onPress={() => navigation.navigate('CreateKeysUX')}
      title={t('Create master key')}
      style={styles.marginBottom}
    />
  ) : (
    <ButtonAlt
      onPress={() => navigation.navigate('KeysInfo')}
      title={t('Reveal master key')}
      style={styles.marginBottom}
    />
  )
