import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { MediumText, SemiBoldText } from '../typography'
import CopyField from '../activity/CopyField'
import { colors } from '../../styles'
import { SmartWalletFactory } from '../../lib/core/SmartWalletFactory'
import EditMaterialIcon from '../icons/EditMaterialIcon'

type AccountBoxProps = {
  address: string
  addressShort: string
  smartWalletAddress: string
  smartWalletAddressShort: string
  smartWalletFactory: SmartWalletFactory
}

const AccountBox: React.FC<AccountBoxProps> = ({
  address,
  addressShort,
  smartWalletAddress,
  smartWalletAddressShort,
  smartWalletFactory,
}) => {
  const [isDeployed, setIsDeployed] = useState(false)
  useEffect(() => {
    smartWalletFactory.isDeployed().then(result => setIsDeployed(result))
  }, [])
  return (
    <View style={styles.accountsContainer}>
      <View style={styles.textContainer}>
        {/* @TODO implement account naming */}
        <SemiBoldText style={styles.text}>account 1</SemiBoldText>
        <EditMaterialIcon style={styles.icon} size={15} />
      </View>
      <View style={styles.infoSection}>
        <MediumText>Status</MediumText>
        <SemiBoldText>{isDeployed ? 'Deployed' : 'Not Deployed'}</SemiBoldText>
      </View>
      <View style={styles.infoSection}>
        <MediumText style={styles.addressText}>EOA Address</MediumText>
        <CopyField
          text={addressShort}
          textToCopy={address}
          TextComp={SemiBoldText}
        />
      </View>
      <View style={styles.infoSection}>
        <MediumText style={styles.addressText}>Smart Wallet Address</MediumText>
        <CopyField
          text={smartWalletAddressShort}
          textToCopy={smartWalletAddress}
          TextComp={SemiBoldText}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  accountsContainer: {
    backgroundColor: colors.background.light,
    padding: 20,
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
  infoSection: {
    marginBottom: 20,
  },
  addressText: {
    marginBottom: 3,
  },
})

export default AccountBox
