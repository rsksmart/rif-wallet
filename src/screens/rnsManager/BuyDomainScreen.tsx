import { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { BigNumber, utils } from 'ethers'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import moment from 'moment'

import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from 'src/styles'
import { rnsManagerStyles } from './rnsManagerStyles'

import { PrimaryButton } from 'src/components/button/PrimaryButton'

import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { ScreenWithWallet } from '../types'
import { MediumText } from 'src/components'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'
import { TokenImage } from '../home/TokenImage'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import { errorHandler } from 'shared/utils'

type Props = RootStackScreenProps<rootStackRouteNames.BuyDomain> &
  ScreenWithWallet

export const BuyDomainScreen = ({ wallet, navigation, route }: Props) => {
  const { alias, domainSecret, duration } = route.params
  const fullAlias = alias + '.rsk'

  const expiryDate = moment(moment(), 'MM-DD-YYYY').add(duration, 'years')

  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [registerInProcess, setRegisterInProcess] = useState(false)
  const [domainPrice, setDomainPrice] = useState<BigNumber>()
  const [domainFiatPrice, setDomainFiatPrice] = useState<number>(0.0)

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )

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
  }, [])

  const registerDomain = async (domain: string) => {
    try {
      const durationToRegister = BigNumber.from(2)
      if (domainPrice) {
        const tx = await rskRegistrar.register(
          domain,
          wallet.smartWallet.address,
          domainSecret,
          durationToRegister,
          domainPrice,
        )

        setRegisterDomainInfo('Transaction sent. Please wait...')
        setRegisterInProcess(true)

        navigation.navigate(rootStackRouteNames.AliasBought, {
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
          onPress={() => navigation.navigate('SearchDomain')}
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
