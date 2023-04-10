import { useCallback, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BigNumber, Transaction } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'
import { useTranslation } from 'react-i18next'

import { AppButton, Typography, AppSpinner } from 'components/index'
import { setWalletIsDeployed } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { defaultChainType, getTokenAddress } from 'core/config'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { ScreenWithWallet } from '../types'

export const RelayDeployScreen = ({
  wallet,
  isWalletDeployed,
}: ScreenWithWallet) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const updateErrorState = useCallback((error: string | null) => {
    setDeployError(error)
  }, [])

  const deploy = useCallback(async () => {
    updateErrorState(null)
    setIsDeploying(true)
    const freePayment = {
      tokenContract: getTokenAddress(
        defaultChainType === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        defaultChainType,
      ),
      tokenAmount: BigNumber.from(0),
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: TransactionResponse) => {
        setSmartWalletDeployTx(result)

        result.wait().then((receipt: TransactionReceipt) => {
          if (receipt.status) {
            dispatch(
              setWalletIsDeployed({
                address: wallet.smartWallet.address,
                value: true,
              }),
            )
          } else {
            updateErrorState('Tx failed, could not deploy smart wallet')
          }
          setIsDeploying(false)
        })
      })
      .catch((error: Error) => {
        updateErrorState(error.toString())
        setIsDeploying(false)
      })
  }, [dispatch, updateErrorState, wallet])

  return (
    <ScrollView
      style={sharedStyles.screen}
      contentContainerStyle={sharedStyles.flexGrow}>
      <Typography style={styles.title} type="h2" color={sharedColors.white}>
        {t('wallet_deploy_title')}
      </Typography>

      <Typography
        type="body3"
        color={sharedColors.labelLight}
        style={styles.description}>
        {t('wallet_deploy_desc1')}
      </Typography>
      <Typography
        type="body3"
        color={sharedColors.labelLight}
        style={styles.description}>
        {t('wallet_deploy_desc2')}
      </Typography>

      {isWalletDeployed ? (
        <View style={styles.walletDeployedWrapper}>
          <Typography type="body1">
            {t('wallet_deploy_wallet_deployed')}
          </Typography>
          <Typography type="body1">{`Hash: ${smartWalletDeployTx?.hash}`}</Typography>
        </View>
      ) : (
        <>
          {!isDeploying ? (
            <>
              <Image
                source={require('assets/images/deploy-wallet.png')}
                style={styles.noDeployImage}
                resizeMethod={'resize'}
                resizeMode={'contain'}
              />
              <AppButton
                title={t('wallet_deploy_button_title')}
                onPress={deploy || isDeploying}
                style={styles.button}
                accessibilityLabel="deploy"
                textColor={sharedColors.black}
              />
            </>
          ) : (
            <View style={styles.spinner}>
              <AppSpinner color="white" size={174} />
              <Typography
                style={styles.deployingWalletText}
                type="body1"
                color={sharedColors.labelLight}>
                {t('wallet_deploy_wallet_deploying')}
              </Typography>
            </View>
          )}

          {deployError && (
            <Typography type="body3" color={sharedColors.danger}>
              {deployError}
            </Typography>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({ marginTop: 10 }),
  description: castStyle.text({
    marginTop: 18,
    textAlign: 'left',
    width: '87%',
  }),
  spinner: castStyle.view({
    marginTop: 120,
    height: 180,
    width: 180,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  noDeployImage: castStyle.image({ height: 352, width: 232, marginTop: 38 }),
  walletDeployedWrapper: castStyle.view({
    flex: 1,
    justifyContent: 'center',
  }),
  deployingWalletText: castStyle.text({
    marginTop: 24,
  }),
  button: castStyle.view({
    position: 'absolute',
    bottom: 14,
    backgroundColor: sharedColors.white,
  }),
})
