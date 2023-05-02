import { FC } from 'react'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { useTranslation } from 'react-i18next'

import { ScreenWithWallet } from 'screens/types'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { RequestWithBitcoin } from 'shared/types'
import { sharedColors } from 'shared/constants'
import { Typography } from 'components/index'

export interface Wallets {
  [id: string]: RIFWallet
}
export interface WalletsIsDeployed {
  [id: string]: {
    loading: boolean
    txHash: string | null
    isDeployed: boolean
  }
}

export type Requests = RequestWithBitcoin[]

export function InjectSelectedWallet<T>(
  Component: FC<ScreenWithWallet & T>,
): FC<T> {
  return function InjectedComponent(props) {
    const { t } = useTranslation()
    const { wallet, walletIsDeployed } = useAppSelector(selectActiveWallet)

    if (!wallet) {
      return (
        <Typography type="h1" color={sharedColors.black}>
          {t('no_selected_wallet')}
        </Typography>
      )
    }

    return (
      <Component wallet={wallet} walletDeployed={walletIsDeployed} {...props} />
    )
  }
}
