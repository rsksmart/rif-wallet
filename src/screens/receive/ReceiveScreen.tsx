import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View, Share } from 'react-native'
import { getAddressDisplayText, Input, Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import { FormProvider, useForm } from 'react-hook-form'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { useTranslation } from 'react-i18next'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { MixedTokenAndNetworkType } from 'screens/send/types'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export type ReceiveScreenProps = {
  username: string
  token?: MixedTokenAndNetworkType
}

export const ReceiveScreen = ({
  username = 'user345crypto.rsk',
  route,
  navigation,
}: ReceiveScreenProps &
  RootTabsScreenProps<rootTabsRouteNames.ReceiveScreen>) => {
  const { t } = useTranslation()
  const methods = useForm()
  const { token } = route.params
  const [selectedAsset, setSelectedAsset] = useState<
    MixedTokenAndNetworkType | undefined
  >(token)
  const [address, setAddress] = useState<string>('')
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const bitcoinCore = useBitcoinContext()
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
        setIsLoadingAddress(true)
        if (asset instanceof BitcoinNetwork) {
          asset.bips[0]
            .fetchExternalAvailableAddress()
            .then(addressReturned => setAddress(addressReturned))
            .finally(() => setIsLoadingAddress(false))
        } else {
          setAddress(rskAddress?.displayAddress || '')
          setIsLoadingAddress(false)
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
                onPress={onChangeSelectedAsset(asset)}
                color={sharedColors.inputInactive}
                primaryText={asset.symbol}
                secondaryText={'123'}
                isSelected={selectedAsset === asset}
              />
            ))}
          </ScrollView>
        </View>
        {/* QR Component */}
        <View style={styles.qrView}>
          {address !== '' && (
            <QRGenerator
              value={address}
              imageSource={require('../../images/arrow-north-east-icon.png')}
              logoBackgroundColor={sharedColors.inputInactive}
            />
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
          placeholder={address}
          isReadOnly
        />
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
})
