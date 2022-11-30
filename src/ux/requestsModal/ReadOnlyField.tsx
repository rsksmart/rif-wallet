import { StyleSheet, Text, View } from 'react-native'

import { RegularText } from '../../components/typography'
import { sharedStyles } from '../../shared/styles'

interface IRealOnlyField {
  label: string
  value: string
  testID: string
}

const ReadOnlyField = ({ label, value, testID }: IRealOnlyField) => {
  return (
    <>
      <View>
        <RegularText style={styles.label}>{label}</RegularText>
      </View>
      <View>
        <View style={sharedStyles.inputText} testID={testID}>
          <Text>{value}</Text>
        </View>
      </View>
    </>
  )
}

export default ReadOnlyField

const styles = StyleSheet.create({
  label: {
    margin: 5,
  },
})
