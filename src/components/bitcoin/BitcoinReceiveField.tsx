import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import ActivityField from '../activity/ActivityField'
import { MediumText } from '../typography'

const BitcoinReceiveField: React.FC<{
  label: string
  innerText: string | undefined
  onFieldPress: () => void
}> = ({ label, innerText, onFieldPress }) => (
  <TouchableOpacity onPress={onFieldPress}>
    <ActivityField title={label} LabelStyle={styles.whiteColor}>
      <View style={styles.viewGrid}>
        <MediumText>{innerText}</MediumText>
        <MediumText style={styles.paddingRight}>Change</MediumText>
      </View>
    </ActivityField>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  whiteColor: { color: 'white' },
  viewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paddingRight: { paddingRight: 15 },
})
export default BitcoinReceiveField
