import { useIsFocused } from '@react-navigation/native'
import { ComponentType, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Clipboard from '@react-native-clipboard/clipboard'

import { AppButton, AppTouchable, Input, Typography } from 'components/index'
import { ConfirmationModal } from 'components/modal'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { WalletContext } from 'shared/wallet'

import { DappItem } from './DappItem'
import {
  SessionStruct,
  WalletConnect2Context,
  WalletConnect2Provider,
} from './WalletConnect2Context'

const withWalletConnectProvider =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const { wallet } = useContext(WalletContext)
    return (
      <WalletConnect2Provider wallet={wallet}>
        <Component {...props} />
      </WalletConnect2Provider>
    )
  }

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

interface WC2Session {
  key: string
  wc: SessionStruct
  name?: string
  url?: string
}

export const WalletConnectScreen = ({ route }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()

  const {
    pendingSession,
    error: walletConnect2Error,
    setError: setWalletConnect2Error,
    sessions,
    onDisconnectSession,
    onUserApprovedSession,
    onUserRejectedSession,
    onCreateNewSession,
  } = useContext(WalletConnect2Context)

  const [disconnectingWC, setDisconnectingWC] = useState<WC2Session | null>(
    null,
  )

  const methods = useForm({ defaultValues: { wcUri: '' } })
  const { watch, setValue } = methods
  const wcUri = watch('wcUri')

  const wc2Sessions: WC2Session[] = sessions.map(session => ({
    name: session.peer.metadata.name,
    url: session.peer.metadata.url,
    key: session.topic,
    wc: session,
  }))

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getString()
    setValue('wcUri', clipboardText)
  }

  const onUriSubmitted = () => {
    setValue('wcUri', '')
    onCreateNewSession(wcUri)
  }

  const handleDisconnectSession = (mergedWc: WC2Session) => async () => {
    await onDisconnectSession(mergedWc.wc)
    setDisconnectingWC(null)
  }

  const onWCDisconnect = (wc: WC2Session) => () => setDisconnectingWC(wc)

  /**
   * useEffect that watches when we pass data to the route params and connects user depending on WC version
   */
  useEffect(() => {
    // When data exists - handle the case
    if (route.params?.data) {
      const { data } = route.params
      if (data.includes('@2')) {
        // WalletConnect 2.0
        onCreateNewSession(data)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.data])

  /**
   * When there is an error in WC2.0 - this effect will show it to the UI
   */
  useEffect(() => {
    if (walletConnect2Error) {
      Alert.alert(t(walletConnect2Error.title), t(walletConnect2Error.message))
      setWalletConnect2Error(undefined)
    }
  }, [walletConnect2Error, t, setWalletConnect2Error])

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.black))
    }
  }, [dispatch, isFocused])

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={styles.innerHeader1}>
          <Typography type="h2">{t('dapps_title')}</Typography>
          <Typography type="h5" style={styles.subtitle}>
            {t('dapps_instructions')}
          </Typography>
        </View>
        <View style={styles.innerHeader2} />
      </View>

      {wc2Sessions.length === 0 ? (
        <Image
          source={require('src/images/empty-dapps.png')}
          style={styles.noDappsImage}
        />
      ) : (
        <ScrollView style={styles.dappsList}>
          {wc2Sessions.map(session => (
            <DappItem
              key={session.key}
              name={session.name}
              url={session.url}
              isDisconnecting={session === disconnectingWC}
              onDisconnect={onWCDisconnect(session)}
            />
          ))}
        </ScrollView>
      )}

      {pendingSession ? (
        <ConfirmationModal
          isVisible
          title={t('dapps_confirmation_title')}
          description={`${t('dapps_confirmation_description')}${
            pendingSession.proposal.params.proposer.metadata.name
              ? ` ${pendingSession.proposal.params.proposer.metadata.name}`
              : ''
          }?`}
          okText={t('dapps_confirmation_button_connect')}
          cancelText={t('dapps_confirmation_button_cancel')}
          onOk={onUserApprovedSession}
          onCancel={onUserRejectedSession}
        />
      ) : null}

      {disconnectingWC ? (
        <ConfirmationModal
          isVisible={Boolean(disconnectingWC)}
          title={t('dapps_confirm_disconnection_title')}
          description={`${t('dapps_confirm_disconnection_description')}${
            disconnectingWC.name ? ` ${disconnectingWC.name}` : ''
          }?`}
          okText={t('dapps_confirm_disconnection_confirm')}
          cancelText={t('dapps_confirm_disconnection_cancel')}
          onOk={handleDisconnectSession(disconnectingWC)}
          onCancel={() => setDisconnectingWC(null)}
        />
      ) : null}
      {/* Insert WC URI Manually */}
      <AppTouchable width={'100%'} onPress={Keyboard.dismiss}>
        <FormProvider {...methods}>
          <Input
            inputName="wcUri"
            label={t('dapps_wc_label')}
            placeholder={t('dapps_insert_wc_uri')}
            autoCapitalize="none"
            autoCorrect={false}
            rightIcon={{
              name: 'paste',
              size: 16,
            }}
            onRightIconPress={handlePaste}
          />
          <AppButton
            title={t('dapps_wc_connect')}
            onPress={onUriSubmitted}
            textColor={sharedColors.black}
            color={sharedColors.white}
            style={styles.subtitle}
            disabled={wcUri.length === 0}
          />
        </FormProvider>
      </AppTouchable>
    </KeyboardAvoidingView>
  )
}

export const WalletConnectScreenWithProvider =
  withWalletConnectProvider(WalletConnectScreen)

const styles = StyleSheet.create({
  header: castStyle.view({
    flexDirection: 'row',
    marginTop: 18,
  }),
  innerHeader1: castStyle.view({
    flex: 3,
  }),
  innerHeader2: castStyle.view({
    flex: 1,
  }),
  subtitle: castStyle.view({
    marginTop: 10,
  }),
  noDappsImage: castStyle.image({
    flex: 4,
    alignSelf: 'center',
    width: '80%',
    resizeMode: 'contain',
  }),
  dappsList: castStyle.view({
    flex: 1,
    marginTop: 20,
  }),
})
