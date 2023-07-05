import { StyleSheet, View } from 'react-native'
import { SignMessageRequest } from '@rsksmart/rif-wallet-core'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'
import { AppButton, Typography } from 'src/components'

interface SignMessageRequestContainerProps {
  request: SignMessageRequest
  onConfirm: () => void
  onCancel: () => void
}

export const SignMessageRequestContainer = ({
  request,
  onCancel,
  onConfirm,
}: SignMessageRequestContainerProps) => {
  const {
    type,
    payload: [message],
  } = request
  const insets = useSafeAreaInsets()

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
        Request
      </Typography>
      <Typography type={'h3'} style={styles.typographyRowStyle}>
        Request type: {type}
      </Typography>
      <Typography type={'h3'} style={styles.typographyRowStyle}>
        Message: {message.toString() || ''}
      </Typography>
      <View style={styles.buttonsViewStyle}>
        <AppButton
          title={'Confirm'}
          onPress={onConfirmTap}
          color={sharedColors.white}
          textColor={sharedColors.black}
          style={styles.buttonsStyle}
        />
        <AppButton
          title={'Cancel'}
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
