import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { resetApp } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { sharedColors } from 'shared/constants'

import { ConfirmationModal, ConfirmationModalConfig } from '..'

interface Props {
  isVisible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

export const DeleteWalletModal = ({ isVisible, setVisible }: Props) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const createEraseUsersDataConfirmationConfig =
    useCallback((): ConfirmationModalConfig => {
      return {
        color: sharedColors.dangerLight,
        title: t('accounts_screen_users_data_reset_title'),
        titleColor: sharedColors.black,
        description: t('accounts_screen_users_data_reset_description'),
        descriptionColor: sharedColors.black,
        onOk: () => dispatch(resetApp({ shouldResetUsersData: true })),
        okText: t('Confirm'),
        onCancel: () => dispatch(resetApp({ shouldResetUsersData: false })),
        cancelText: t('accounts_screen_users_data_reset_save_data'),
        buttons: [
          { color: sharedColors.black, textColor: sharedColors.white },
          { color: sharedColors.black, textColor: sharedColors.black },
        ],
      }
    }, [dispatch, t])

  const createDeleteDefinitiveConfirmationConfig = useCallback(
    (
      createDeleteConfirmationConfigFn: () => ConfirmationModalConfig,
    ): ConfirmationModalConfig => {
      return {
        color: sharedColors.dangerLight,
        title: t(
          'wallet_backup_definitive_delete_confirmation_title',
        ) as string,
        titleColor: sharedColors.black,
        description: t(
          'wallet_backup_definitive_delete_confirmation_description',
        ),
        descriptionColor: sharedColors.black,
        okText: t('Delete'),
        cancelText: t('Cancel'),
        buttons: [
          { color: sharedColors.black, textColor: sharedColors.white },
          { color: sharedColors.black, textColor: sharedColors.black },
        ],
        onOk: () => {
          setConfirmationModalConfig(createEraseUsersDataConfirmationConfig())
        },
        onCancel: () => {
          console.log('ON CANCEL IN createDeleteDefinitiveConfirmationConfig')
          setVisible(false)
          setConfirmationModalConfig(createDeleteConfirmationConfigFn())
        },
      }
    },
    [t, setVisible, createEraseUsersDataConfirmationConfig],
  )

  const createDeleteConfirmationConfig =
    useCallback((): ConfirmationModalConfig => {
      return {
        color: sharedColors.dangerLight,
        title: t('wallet_backup_delete_confirmation_title') as string,
        titleColor: sharedColors.black,
        description: t(
          'wallet_backup_delete_confirmation_description',
        ) as string,
        descriptionColor: sharedColors.black,
        okText: t('Delete') as string,
        cancelText: t('Cancel') as string,
        buttons: [
          { color: sharedColors.black, textColor: sharedColors.white },
          { color: sharedColors.black, textColor: sharedColors.black },
        ],
        onOk: () => {
          setConfirmationModalConfig(
            createDeleteDefinitiveConfirmationConfig(
              createDeleteConfirmationConfig,
            ),
          )
        },
        onCancel: () => {
          setVisible(false)
        },
      }
    }, [t, createDeleteDefinitiveConfirmationConfig, setVisible])

  const [confirmationModalConfig, setConfirmationModalConfig] =
    useState<ConfirmationModalConfig>(createDeleteConfirmationConfig)

  return (
    <ConfirmationModal
      isVisible={isVisible}
      color={confirmationModalConfig.color}
      title={confirmationModalConfig.title}
      titleColor={confirmationModalConfig.titleColor}
      description={confirmationModalConfig.description}
      descriptionColor={confirmationModalConfig.descriptionColor}
      okText={confirmationModalConfig.okText}
      cancelText={confirmationModalConfig.cancelText}
      buttons={confirmationModalConfig.buttons}
      onOk={confirmationModalConfig.onOk}
      onCancel={confirmationModalConfig.onCancel}
    />
  )
}
