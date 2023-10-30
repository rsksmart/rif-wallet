import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { unlockApp } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { WalletContext } from 'shared/wallet'

export const RetryLogin = () => {
  const { setWallet, setWalletIsDeployed } = useContext(WalletContext)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const retryLogin = useCallback(() => {
    dispatch(unlockApp({ setWallet, setWalletIsDeployed }))
  }, [dispatch, setWallet, setWalletIsDeployed])

  return (
    <View style={[sharedStyles.screen, sharedStyles.contentCenter]}>
      <AppButton
        onPress={retryLogin}
        title={t('initial_screen_button_retry_login')}
        color={sharedColors.white}
        textColor={sharedColors.black}
      />
    </View>
  )
}
