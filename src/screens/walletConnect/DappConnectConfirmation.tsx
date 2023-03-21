import WalletConnect from '@walletconnect/client'
import { t } from 'i18next'
import { useContext } from 'react'

import { SlidePopupConfirmationInfo } from 'components/slidePopup/SlidePopupConfirmationInfo'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { WalletConnectContext } from './WalletConnectContext'

type Props = {
  connector: WalletConnect
}

export const DAppConnectConfirmation = ({ connector: c }: Props) => {
  const { handleApprove, handleReject } = useContext(WalletConnectContext)
  const { wallet } = useAppSelector(selectActiveWallet)
  const dappName = c.peerMeta?.name
  return (
    <SlidePopupConfirmationInfo
      title={t('dapps_confirmation_title')}
      description={`${t('dapps_confirmation_description')}${
        dappName ? ` ${dappName}` : ''
      }?`}
      confirmText={t('dapps_confirmation_button_connect')}
      cancelText={t('dapps_confirmation_button_cancel')}
      onConfirm={() => handleApprove(c, wallet)}
      onCancel={() => handleReject(c)}
      height={300}
    />
  )
}
