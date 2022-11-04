import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { RegularText } from '../../components/typography'
import { sharedStyles } from './sharedStyles'

type IRealOnlyField = {
  label: string
  value: string
  testID: string
}

const ReadOnlyField: React.FC<IRealOnlyField> = ({ label, value, testID }) => {
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
