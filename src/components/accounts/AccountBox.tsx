import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { MediumText } from '../typography'
import { colors } from '../../styles'
import { SmartWalletFactory } from '../../lib/core/SmartWalletFactory'
import AccountField from './AccountField'
import accountSharedStyles from './styles'
import { PublicKeyItemType } from '../../screens/accounts/types'

type AccountBoxProps = {
  address: string
  addressShort: string
  smartWalletAddress: string
  smartWalletAddressShort: string
  smartWalletFactory: SmartWalletFactory
  id?: number
  publicKeys: PublicKeyItemType[]
}

const AccountBox: React.FC<AccountBoxProps> = ({
  address,
  addressShort,
  smartWalletAddress,
  smartWalletAddressShort,
  smartWalletFactory,
  publicKeys = [],
  id = 0,
}) => {
  const [isDeployed, setIsDeployed] = useState(false)
  useEffect(() => {
    smartWalletFactory.isDeployed().then(result => setIsDeployed(result))
  }, [])
  return (
    <View style={styles.accountsContainer}>
      <View style={styles.textContainer}>
        {/* @TODO implement account naming - will use id for now */}
        <MediumText style={styles.text}>account {id + 1}</MediumText>
        {/*<EditMaterialIcon style={styles.icon} size={11} />*/}
      </View>
      <View style={accountSharedStyles.infoSection}>
        <MediumText style={styles.titleFontSize}>Status</MediumText>
        <MediumText style={styles.titleFontSize}>
          {isDeployed ? 'Deployed' : 'Not Deployed'}
        </MediumText>
      </View>
      <AccountField
        label="EOA Address"
        value={addressShort}
        valueToCopy={address}
      />
      <AccountField
        label="Smart Wallet Address"
        value={smartWalletAddressShort}
        valueToCopy={smartWalletAddress}
      />
      {publicKeys.map(publicKey => (
        <AccountField
          label={publicKey.networkName + ' Public Key'}
          value={publicKey.shortedPublicKey}
          valueToCopy={publicKey.publicKey}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  accountsContainer: {
    backgroundColor: colors.background.light,
    paddingHorizontal: 24,
    paddingVertical: 38,
    borderRadius: 30,
  },
  textContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
  },
  icon: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 1,
  },
  titleFontSize: {
    fontSize: 13,
  },
})

export default AccountBox
