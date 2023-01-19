import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from 'src/styles'

import { MediumText } from '../typography'
import CopyField from '../activity/CopyField'
import accountSharedStyles from './styles'

const MediumTextStyleOverride: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <MediumText style={styles.mediumTextOverride}>{children}</MediumText>

type AccountFieldType = {
  label: string
  value: string
  valueToCopy: string
}
const AccountField: React.FC<AccountFieldType> = ({
  label,
  value,
  valueToCopy,
}) => (
  <View style={accountSharedStyles.infoSection}>
    <MediumText style={styles.addressText}>{label}</MediumText>
    <CopyField
      text={value}
      textToCopy={valueToCopy}
      TextComp={MediumTextStyleOverride}
      iconSize={20}
      iconViewBox="0 0 25 25"
    />
  </View>
)

const styles = StyleSheet.create({
  addressText: {
    marginBottom: 3,
    fontSize: 13,
    color: colors.darkGray,
  },
  mediumTextOverride: {
    fontSize: 13,
    flex: 90,
    color: colors.darkGray,
  },
})

export default AccountField
