import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { resetApp, unlockApp } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { useInitializeWallet } from 'shared/wallet'
import { useSetGlobalError } from 'components/GlobalErrorHandler'

export const RetryLogin = () => {
  const initializeWallet = useInitializeWallet()
  const setGlobalError = useSetGlobalError()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const retryLogin = useCallback(() => {
    dispatch(unlockApp({ initializeWallet, setGlobalError }))
  }, [dispatch, initializeWallet, setGlobalError])

  return (
    <View style={[sharedStyles.screen, sharedStyles.contentCenter]}>
      <AppButton
        onPress={retryLogin}
        title={t('initial_screen_button_retry_login')}
        color={sharedColors.white}
        textColor={sharedColors.black}
      />
      {__DEV__ && (
        <AppButton
          onPress={() => dispatch(resetApp())}
          title={t('initial_screen_button_reset_app')}
          color={sharedColors.danger}
          textColor={sharedColors.white}
        />
      )}
    </View>
  )
}
