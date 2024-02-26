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

  const eraseWallet = useCallback(() => {
    dispatch(resetApp())
  }, [dispatch])

  const createDeleteDefinitiveConfirmationConfig = useCallback(
    (
      createDeleteConfirmationConfigFn: () => ConfirmationModalConfig,
    ): ConfirmationModalConfig => {
      return {
        backgroundColor: sharedColors.dangerLight,
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
        onOk: eraseWallet,
        onCancel: () => {
          console.log('ON CANCEL IN createDeleteDefinitiveConfirmationConfig')
          setVisible(false)
          setConfirmationModalConfig(createDeleteConfirmationConfigFn())
        },
      }
    },
    [t, eraseWallet, setVisible],
  )

  const createDeleteConfirmationConfig =
    useCallback((): ConfirmationModalConfig => {
      return {
        backgroundColor: sharedColors.dangerLight,
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
      backgroundColor={confirmationModalConfig.backgroundColor}
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
