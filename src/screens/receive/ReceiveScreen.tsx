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

import { shortAddress } from 'lib/utils'

import { getAddressDisplayText, Input, Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { MixedTokenAndNetworkType } from 'screens/send/types'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export const ReceiveScreen = ({
  route,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Receive>) => {
  const username = 'user345crypto.rsk' // @TODO find where this is coming from
  const { t } = useTranslation()
  const methods = useForm()
  const bitcoinCore = useBitcoinContext()

  const { token, networkId } = route.params
  const [selectedAsset, setSelectedAsset] = useState<
    MixedTokenAndNetworkType | undefined
  >((networkId && bitcoinCore?.networksMap[networkId]) || token)
  const [address, setAddress] = useState<string>('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)

  const tokenBalances = useAppSelector(selectBalances)
  const { wallet, chainType } = useAppSelector(selectActiveWallet)

  const rskAddress = useMemo(() => {
    if (wallet && chainType) {
      return getAddressDisplayText(wallet.smartWalletAddress, chainType)
    }
    return null
  }, [wallet, chainType])

  const assets = useMemo(() => {
    const newAssets = []
    if (bitcoinCore?.networks) {
      newAssets.push(...bitcoinCore?.networks)
    }
    newAssets.push(...Object.values(tokenBalances))
    return newAssets
  }, [bitcoinCore?.networks, tokenBalances])

  const onShareUsername = useCallback(() => {
    Share.share({
      message: username,
    })
  }, [username])

  const onShareAddress = useCallback(() => {
    Share.share({
      message: address,
    })
  }, [address])

  const onBackPress = () => navigation.goBack()

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
          setAddress(rskAddress?.displayAddress || '')
          setIsAddressLoading(false)
        }
      }
    },
    [rskAddress?.displayAddress],
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
        {/* Receive and go back button */}
        <View style={styles.headerStyle}>
          <Ionicons
            name="chevron-back"
            size={20}
            color="white"
            onPress={onBackPress}
          />
          <View>
            <Typography type={'h4'}>{t('Receive')}</Typography>
          </View>
          <View />
        </View>
        {/* Change Asset Component */}
        <Typography type="h4">{t('CHANGE_ASSET')}</Typography>
        <View style={styles.flexRow}>
          <ScrollView horizontal>
            {assets.map(asset => (
              <PortfolioCard
                key={asset.symbol}
                onPress={onChangeSelectedAsset(asset)}
                color={sharedColors.inputInactive}
                primaryText={asset.symbol}
                secondaryText={'123'}
                isSelected={
                  selectedAsset !== undefined &&
                  selectedAsset.symbol === asset.symbol
                }
              />
            ))}
          </ScrollView>
        </View>
        {/* QR Component */}
        <View style={styles.qrView}>
          {address !== '' && !isAddressLoading && (
            <QRGenerator
              value={address}
              imageSource={require('../../images/rif.png')}
              logoBackgroundColor={sharedColors.inputInactive}
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
            />
          }
          placeholder={username}
          isReadOnly
        />
        {/* Address Component */}
        {isAddressLoading && (
          <View style={styles.addressLoadingView}>
            <Typography type="h4" style={styles.loadingTypographyStyle}>
              {t('loading_address')}...
            </Typography>
            <ActivityIndicator size={'large'} />
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
              />
            }
            placeholder={shortAddress(address)}
            isReadOnly
          />
        )}
      </FormProvider>
      <View style={styles.emptyPadding} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: sharedColors.secondary,
    minHeight: '100%',
    paddingHorizontal: 24,
  },
  qrView: {
    paddingHorizontal: 35,
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 84,
    borderRadius: 20,
    marginTop: 5,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 22.5,
  },
  emptyPadding: { paddingVertical: 15 },
  flexRow: { flexDirection: 'row' },
  loadingTypographyStyle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  addressLoadingView: { justifyContent: 'center' },
})
