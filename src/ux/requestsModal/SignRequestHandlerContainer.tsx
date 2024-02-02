import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { SignMessageRequest, SignTypedDataRequest } from 'lib/eoaWallet'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'
import { AppButton, Typography } from 'src/components'

import { SignMessageComponent } from './SignMessageComponent'
import { SignTypedDataComponent } from './SignTypedDataComponent'

interface SignMessageRequestContainerProps {
  request: SignMessageRequest | SignTypedDataRequest
  onConfirm: () => void
  onCancel: () => void
}

export const SignRequestHandlerContainer = ({
  request,
  onCancel,
  onConfirm,
}: SignMessageRequestContainerProps) => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const { type, payload } = request

  const onConfirmTap = async () => {
    await request.confirm()
    onConfirm()
  }

  const onCancelTap = () => {
    request.reject('User rejected')
    onCancel()
  }

  return (
    <View style={[styles.viewContainer, { paddingTop: insets.top || 40 }]}>
      <Typography type={'h2'} style={styles.typographyHeaderStyle}>
        {t('request_username_button')}
      </Typography>
      <Typography type={'h3'} style={styles.typographyRowStyle}>
        {t('dapps_sign_message_request_type')}: {type}
      </Typography>

      {type === 'signMessage' && (
        <SignMessageComponent message={payload[0].toString()} />
      )}
      {type === 'signTypedData' && <SignTypedDataComponent payload={payload} />}

      <View style={styles.buttonsViewStyle}>
        <AppButton
          accessibilityLabel="Confirm"
          title={t('transaction_summary_title_confirm_button_title')}
          onPress={onConfirmTap}
          color={sharedColors.white}
          textColor={sharedColors.black}
          style={styles.buttonsStyle}
        />
        <AppButton
          accessibilityLabel="Cancel"
          title={t('transaction_summary_title_cancel_button_title')}
          onPress={onCancelTap}
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewContainer: castStyle.view({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: sharedColors.black,
    zIndex: 999,
    paddingHorizontal: 24,
  }),
  typographyHeaderStyle: castStyle.text({
    marginBottom: 40,
  }),
  typographyRowStyle: castStyle.text({
    marginBottom: 20,
  }),
  buttonsViewStyle: castStyle.view({
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  }),
  buttonsStyle: castStyle.view({
    marginVertical: 20,
  }),
})
