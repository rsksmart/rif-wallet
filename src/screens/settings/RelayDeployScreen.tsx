import { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BigNumber } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome5'

import {
  AppButton,
  Typography,
  AppSpinner,
  AppTouchable,
} from 'components/index'
import {
  setIsDeploying,
  setSmartWalletDeployTx,
  setWalletIsDeployed,
} from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { defaultChainType, getTokenAddress } from 'core/config'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'

import { ScreenWithWallet } from '../types'

export const RelayDeployScreen = ({
  route,
  navigation,
  wallet,
  walletDeployed,
}: SettingsScreenProps<settingsStackRouteNames.RelayDeployScreen> &
  ScreenWithWallet) => {
  const backScreen = route.params?.goBackScreen
  const { loading, isDeployed, txHash } = walletDeployed
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
        defaultChainType === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        defaultChainType,
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
  }, [dispatch, updateErrorState, wallet, t])

  useEffect(() => {
    if (backScreen) {
      const { child, parent } = backScreen
      // TODO: fix this typescript error
      navigation.setOptions({
        headerLeft: () => (
          <AppTouchable
            width={20}
            onPress={() =>
              navigation.navigate(
                parent,
                child
                  ? {
                      screen: child,
                    }
                  : undefined,
              )
            }
            style={sharedStyles.marginLeft24}>
            <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
          </AppTouchable>
        ),
      })
    }
  }, [backScreen, navigation])

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
