import { useTranslation } from 'react-i18next'

import { SlidePopupConfirmationInfo } from 'src/components/slidePopup/SlidePopupConfirmationInfo'

type Props = {
  dappName?: string
  onConfirm: () => void
  onCancel: () => void
}

export const DappDisconnectConfirmation = ({
  dappName = '',
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useTranslation()

  return (
    <SlidePopupConfirmationInfo
      title={t('dapps_confirm_disconnection_title')}
      description={`${t('dapps_confirm_disconnection_description')}${
        dappName ? ` ${dappName}` : ''
      }?`}
      confirmText={t('dapps_confirm_disconnection_confirm')}
      cancelText={t('dapps_confirm_disconnection_cancel')}
      onConfirm={onConfirm}
      onCancel={onCancel}
      height={300}
    />
  )
}
