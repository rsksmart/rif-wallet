import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Share,
  ActivityIndicator,
} from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

import { shortAddress } from 'lib/utils'

import { getAddressDisplayText, Input, Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { MixedTokenAndNetworkType } from 'screens/send/types'
import { selectActiveWallet, selectBitcoin } from 'store/slices/settingsSlice'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { getTokenColor } from 'screens/home/tokenColor'
import { castStyle } from 'shared/utils'
import { getBalance } from 'screens/home/PortfolioComponent'
import { selectProfile } from 'store/slices/profileSlice'
import { getIconSource } from 'screens/home/TokenImage'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  UsernameText = 'Address.UsernameText',
  ShareAddressButton = 'Address.ShareButton',
  ShareUsernameButton = 'Username.ShareButton',
}

export const ReceiveScreen = ({
  route,
}: HomeStackScreenProps<homeStackRouteNames.Receive>) => {
  const { t } = useTranslation()
  const methods = useForm()
  const bitcoinCore = useAppSelector(selectBitcoin)

  const tokenBalances = useAppSelector(selectBalances)

  const assets = useMemo(() => {
    const newAssets: Array<BitcoinNetwork | ITokenWithoutLogo> = [
      ...Object.values(tokenBalances),
    ]
    if (bitcoinCore?.networksArr) {
      newAssets.push(...bitcoinCore.networksArr)
    }

    return newAssets
  }, [bitcoinCore?.networksArr, tokenBalances])

  const { token, networkId } = route.params
  const [selectedAsset, setSelectedAsset] = useState<
    MixedTokenAndNetworkType | undefined
  >((networkId && bitcoinCore?.networksMap[networkId]) || token || assets[0])
  const [address, setAddress] = useState<string>('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)

  const [shouldShowAssets, setShouldShowAssets] = useState(false)

  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  const profile = useAppSelector(selectProfile)

  const rskAddress = useMemo(() => {
    if (wallet && chainType) {
      return getAddressDisplayText(wallet.smartWalletAddress, chainType)
    }
    return null
  }, [wallet, chainType])

  const onShareUsername = useCallback(() => {
    Share.share({
      message: profile?.alias || '',
    })
  }, [profile?.alias])

  const onShareAddress = useCallback(() => {
    Share.share({
      message: address,
    })
  }, [address])

  const onChevronAssetShowTap = useCallback(
    () => setShouldShowAssets(curr => !curr),
    [],
  )

  // Function to get the address
  const onGetAddress = useCallback(
    (asset: MixedTokenAndNetworkType) => {
      if (asset) {
        setIsAddressLoading(true)
        if (asset instanceof BitcoinNetwork) {
          asset.bips[0]
            .fetchExternalAvailableAddress()
            .then(addressReturned => setAddress(addressReturned))
            .finally(() => setIsAddressLoading(false))
        } else {
          setAddress(rskAddress?.checksumAddress || '')
          setIsAddressLoading(false)
        }
      }
    },
    [rskAddress?.checksumAddress],
  )

  const onChangeSelectedAsset = useCallback(
    asset => () => setSelectedAsset(asset),
    [],
  )

  useEffect(() => {
    if (selectedAsset) {
      onGetAddress(selectedAsset)
    }
  }, [onGetAddress, selectedAsset])

  return (
    <ScrollView style={styles.parent}>
      <FormProvider {...methods}>
        {/* Change Asset Component */}
        <View style={styles.flexRow}>
          <Typography type="h4">{t('change_asset')}</Typography>
          <FontAwesome5Icon
            name={shouldShowAssets ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="white"
            onPress={onChevronAssetShowTap}
            style={styles.assetsChevronText}
          />
        </View>
        {shouldShowAssets && (
          <ScrollView horizontal>
            {assets.map(asset => {
              const isSelected =
                selectedAsset !== undefined &&
                selectedAsset.symbol === asset.symbol

              const color = isSelected
                ? getTokenColor(asset.symbol)
                : sharedColors.inputInactive

              const balance = getBalance(asset)
              return (
                <PortfolioCard
                  key={asset.symbol}
                  onPress={onChangeSelectedAsset(asset)}
                  color={color}
                  primaryText={asset.symbol}
                  secondaryText={balance}
                  isSelected={isSelected}
                  disabled={isAddressLoading}
                />
              )
            })}
          </ScrollView>
        )}
        {/* QR Component */}
        <View style={styles.qrView}>
          {address !== '' && !isAddressLoading && (
            <QRGenerator
              key={selectedAsset?.symbol}
              value={address}
              imageSource={getIconSource(selectedAsset?.symbol || '')}
              logoBackgroundColor={sharedColors.inputInactive}
              testID={TestID.QRCodeDisplay}
            />
          )}
          {isAddressLoading && (
            <View style={styles.addressLoadingView}>
              <Typography type="h4" style={styles.loadingTypographyStyle}>
                {t('loading_qr')}...
              </Typography>
              <ActivityIndicator size={'large'} />
            </View>
          )}
        </View>
        {/* Username Component */}
        <Input
          label="Username"
          inputName="username"
          rightIcon={
            <Ionicons
              name="share-outline"
              size={20}
              color="white"
              onPress={onShareUsername}
              testID={TestID.ShareUsernameButton}
              disabled={profile.status !== ProfileStatus.USER}
            />
          }
          placeholder={profile.alias}
          isReadOnly
          testID={TestID.UsernameText}
        />
        {/* Address Component */}
        {isAddressLoading && (
          <View style={[styles.addressLoadingView, styles.marginTopView]}>
            <Typography type="h4" style={styles.loadingTypographyStyle}>
              {t('loading_address')}...
            </Typography>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isAddressLoading && (
          <Input
            label="Address"
            inputName="address"
            rightIcon={
              <Ionicons
                name="share-outline"
                size={20}
                color="white"
                onPress={onShareAddress}
                testID={TestID.ShareAddressButton}
              />
            }
            placeholder={shortAddress(address, 10)}
            isReadOnly
            testID={TestID.AddressText}
          />
        )}
      </FormProvider>
      <View style={styles.emptyPadding} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: castStyle.view({
    backgroundColor: sharedColors.black,
    flex: 1,
    paddingHorizontal: 24,
  }),
  qrView: castStyle.view({
    paddingHorizontal: 35,
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 84,
    borderRadius: 20,
    marginTop: 5,
  }),
  headerStyle: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 22.5,
  }),
  emptyPadding: castStyle.view({
    paddingVertical: 15,
  }),
  flexRow: castStyle.view({
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  }),
  loadingTypographyStyle: castStyle.text({
    textAlign: 'center',
    marginBottom: 10,
  }),
  addressLoadingView: castStyle.view({
    justifyContent: 'center',
  }),
  marginTopView: castStyle.view({
    marginTop: 20,
  }),
  flexView: castStyle.view({
    flex: 1,
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
  width50View: castStyle.view({
    width: '50%',
  }),
  assetsChevronText: castStyle.text({
    width: '25%',
    textAlign: 'right',
  }),
})
