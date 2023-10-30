import { useCallback, useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BigNumber } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'
import { useTranslation } from 'react-i18next'

import { AppButton, Typography, AppSpinner } from 'components/index'
import {
  selectChainId,
  setIsDeploying,
  setSmartWalletDeployTx,
  setWalletIsDeployed,
} from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { getTokenAddress } from 'core/config'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedHeaderLeftOptions } from 'navigation/index'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { chainTypesById } from 'shared/constants/chainConstants'
import { WalletContext } from 'src/shared/wallet'

export const RelayDeployScreen = ({
  route,
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.RelayDeployScreen>) => {
  const backScreen = route.params?.goBackScreen
  const { wallet, walletIsDeployed } = useContext(WalletContext)
  const chainId = useAppSelector(selectChainId)
  const { loading, isDeployed, txHash } = walletIsDeployed!
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [deployError, setDeployError] = useState<string | null>(null)
  const updateErrorState = useCallback((error: string | null) => {
    setDeployError(error)
  }, [])

  const deploy = useCallback(async () => {
    updateErrorState(null)
    dispatch(setIsDeploying({ address: wallet.address, isDeploying: true }))
    const freePayment = {
      tokenContract: getTokenAddress(
        chainTypesById[chainId] === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        chainTypesById[chainId],
      ),
      tokenAmount: BigNumber.from(0),
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: TransactionResponse) => {
        dispatch(
          setSmartWalletDeployTx({
            txHash: result.hash,
            address: wallet.address,
          }),
        )

        result.wait().then((receipt: TransactionReceipt) => {
          if (receipt.status) {
            dispatch(
              setWalletIsDeployed({
                address: wallet.smartWallet.address,
                value: true,
              }),
            )
          } else {
            console.log('Deploy Error,', receipt)
            updateErrorState(t('wallet_deploy_error'))
          }
          dispatch(
            setIsDeploying({ address: wallet.address, isDeploying: false }),
          )
        })
      })
      .catch((error: Error) => {
        updateErrorState(error.toString())
        dispatch(
          setIsDeploying({ address: wallet.address, isDeploying: false }),
        )
      })
  }, [dispatch, updateErrorState, wallet, t, chainId])

  useEffect(() => {
    if (backScreen) {
      const { child, parent } = backScreen
      // TODO: fix this typescript error
      // if wallet is not deployed go Home
      navigation.setOptions({
        headerLeft: () =>
          sharedHeaderLeftOptions(() =>
            !isDeployed
              ? navigation.navigate(rootTabsRouteNames.Home, {
                  screen: homeStackRouteNames.Main,
                })
              : navigation.navigate(parent, {
                  screen: child,
                  params: {},
                }),
          ),
      })
    }
  }, [backScreen, navigation, isDeployed])

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
      {isDeployed && txHash ? (
        <View style={styles.walletDeployedWrapper}>
          <Typography type="body1">
            {t('wallet_deploy_wallet_deployed')}
          </Typography>

          <Typography type="body1">{`Hash: ${txHash}`}</Typography>
        </View>
      ) : null}
      {loading ? (
        <View style={styles.spinner}>
          <AppSpinner color="white" size={174} />
          <Typography
            style={styles.deployingWalletText}
            type="body1"
            color={sharedColors.labelLight}>
            {t('wallet_deploy_wallet_deploying')}
          </Typography>
        </View>
      ) : null}
      {!isDeployed && !loading && (
        <>
          <Image
            source={require('assets/images/deploy-wallet.png')}
            style={styles.noDeployImage}
            resizeMethod={'resize'}
            resizeMode={'contain'}
          />
          <AppButton
            title={t('wallet_deploy_button_title')}
            onPress={deploy}
            style={styles.button}
            accessibilityLabel="deploy"
            textColor={sharedColors.black}
          />
        </>
      )}
      {deployError && (
        <Typography type="body3" color={sharedColors.danger}>
          {deployError}
        </Typography>
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
