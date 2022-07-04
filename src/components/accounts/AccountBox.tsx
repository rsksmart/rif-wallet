import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { MediumText } from '../typography'
import CopyField from '../activity/CopyField'
import { colors } from '../../styles'
import { SmartWalletFactory } from '../../lib/core/SmartWalletFactory'
// import EditMaterialIcon from '../icons/EditMaterialIcon'

type AccountBoxProps = {
  address: string
  addressShort: string
  smartWalletAddress: string
  smartWalletAddressShort: string
  smartWalletFactory: SmartWalletFactory
  id?: number
}

const MediumTextStyleOverride: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <MediumText style={styles.mediumTextOverride}>{children}</MediumText>

const AccountBox: React.FC<AccountBoxProps> = ({
  address,
  addressShort,
  smartWalletAddress,
  smartWalletAddressShort,
  smartWalletFactory,
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
      <View style={styles.infoSection}>
        <MediumText style={styles.titleFontSize}>Status</MediumText>
        <MediumText style={styles.titleFontSize}>
          {isDeployed ? 'Deployed' : 'Not Deployed'}
        </MediumText>
      </View>
      <View style={styles.infoSection}>
        <MediumText style={styles.addressText}>EOA Address</MediumText>
        <CopyField
          text={addressShort}
          textToCopy={address}
          TextComp={MediumTextStyleOverride}
          iconSize={20}
          iconViewBox="0 0 25 25"
        />
      </View>
      <View>
        <MediumText style={styles.addressText}>Smart Wallet Address</MediumText>
        <CopyField
          text={smartWalletAddressShort}
          textToCopy={smartWalletAddress}
          TextComp={MediumTextStyleOverride}
          iconSize={20}
          iconViewBox="0 0 25 25"
        />
      </View>
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
  infoSection: {
    marginBottom: 20,
  },
  addressText: {
    marginBottom: 3,
    fontSize: 13,
  },
  titleFontSize: {
    fontSize: 13,
  },
  mediumTextOverride: {
    fontSize: 13,
    flex: 90,
  },
})

export default AccountBox
