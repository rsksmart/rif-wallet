import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { sharedColors, sharedStyles } from 'shared/constants'
import { AppButton } from 'components/index'
import { unlockApp } from 'store/slices/settingsSlice'
import { castStyle } from 'shared/utils'
import { DeleteWalletModal } from 'components/modal/deleteWalletModal'
import { useAppDispatch } from 'store/storeUtils'

export const RetryLogin = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)

  const retryLogin = useCallback(() => {
    dispatch(unlockApp({}))
  }, [dispatch])

  return (
    <View style={[sharedStyles.screen, sharedStyles.contentCenter]}>
      <AppButton
        onPress={retryLogin}
        title={t('initial_screen_button_retry_login')}
        color={sharedColors.white}
        textColor={sharedColors.black}
      />
      <AppButton
        onPress={() => setIsDeleteConfirmationVisible(true)}
        title={t('initial_screen_button_erase_wallet')}
        style={styles.btn}
        color={sharedColors.danger}
        textColor={sharedColors.white}
      />
      <DeleteWalletModal
        isVisible={isDeleteConfirmationVisible}
        setVisible={setIsDeleteConfirmationVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  btn: castStyle.view({
    marginTop: 12,
  }),
})
