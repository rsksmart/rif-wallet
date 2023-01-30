import { useState, useEffect, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { BigNumber, utils } from 'ethers'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import moment from 'moment'

import { colors } from 'src/styles'
import { rnsManagerStyles } from './rnsManagerStyles'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { MediumText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'
import { TokenImage } from '../home/TokenImage'
import { errorHandler } from 'shared/utils'
import { deleteAliasRegistration } from 'storage/AliasRegistrationStore'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { ScreenWithWallet } from '../types'

type Props = ProfileStackScreenProps<profileStackRouteNames.BuyDomain> &
  ScreenWithWallet

export const BuyDomainScreen = ({ wallet, navigation, route }: Props) => {
  const { alias, domainSecret, duration } = route.params
  const fullAlias = alias + '.rsk'
  const rskRegistrar = useMemo(
    () =>
      new RSKRegistrar(
        addresses.rskOwnerAddress,
        addresses.fifsAddrRegistrarAddress,
        addresses.rifTokenAddress,
        wallet,
      ),
    [wallet],
  )

  const expiryDate = moment(moment(), 'MM-DD-YYYY').add(duration, 'years')

  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [registerInProcess, setRegisterInProcess] = useState(false)
  const [domainPrice, setDomainPrice] = useState<BigNumber>()
  const [domainFiatPrice, setDomainFiatPrice] = useState<number>(0.0)

  useEffect(() => {
    setDomainPrice(undefined)
    if (duration) {
      rskRegistrar.price(alias, BigNumber.from(duration)).then(price => {
        setDomainPrice(price)
        const rifPrice: number = parseFloat(utils.formatUnits(price, 18))
        const rifMockPrice = 0.05632
        setDomainFiatPrice(rifMockPrice * rifPrice)
      })
    }
  }, [alias, duration, setDomainPrice, rskRegistrar])

  const registerDomain = async (domain: string) => {
    try {
      const durationToRegister = BigNumber.from(2)
      if (domainPrice) {
        const tx = await rskRegistrar.register(
          domain,
          wallet.smartWallet.smartWalletAddress,
          domainSecret,
          durationToRegister,
          domainPrice,
        )
        deleteAliasRegistration()
        setRegisterDomainInfo('Transaction sent. Please wait...')
        setRegisterInProcess(true)

        navigation.navigate(profileStackRouteNames.AliasBought, {
          alias: alias,
          tx,
        })
      }
    } catch (e) {
      setRegisterInProcess(false)
      setRegisterDomainInfo(errorHandler(e))
    }
  }

  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(profileStackRouteNames.SearchDomain)
          }
          accessibilityLabel="search">
          <View style={rnsManagerStyles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={rnsManagerStyles.container}>
        <TitleStatus
          title={'Buy alias'}
          subTitle={'next: Confirm'}
          progress={0.66}
          progressText={'3/4'}
        />
        <View style={rnsManagerStyles.marginBottom}>
          {domainPrice && (
            <>
              <MediumText style={styles.fiatPriceLabel}>
                ${domainFiatPrice}
              </MediumText>
              <View style={styles.rifTokenImageContainer}>
                <View style={styles.assetIcon}>
                  <TokenImage symbol={'RIF'} height={22} width={25} />
                </View>
                <MediumText style={styles.priceLabel}>
                  {utils.formatUnits(domainPrice, 18)}
                </MediumText>
              </View>
            </>
          )}
          <View style={rnsManagerStyles.profileImageContainer}>
            <AvatarIcon value={fullAlias} size={80} />

            <View>
              <MediumText style={rnsManagerStyles.profileDisplayAlias}>
                {alias}.rsk
              </MediumText>
              <MediumText style={rnsManagerStyles.aliasRequestInfo2}>
                expiry date: {expiryDate.format('MM.DD.YYYY').toString()}
              </MediumText>
            </View>
          </View>
        </View>

        <MediumText style={rnsManagerStyles.aliasRequestInfo}>
          {registerDomainInfo}
        </MediumText>

        <View style={rnsManagerStyles.bottomContainer}>
          {!registerInProcess && (
            <PrimaryButton
              onPress={() => registerDomain(alias)}
              accessibilityLabel="buy"
              title={`buy for $${domainFiatPrice}`}
            />
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  priceLabel: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 25,
  },
  fiatPriceLabel: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 45,
  },
  rifTokenImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  assetIcon: {
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 6,
    marginRight: 10,
  },
})
