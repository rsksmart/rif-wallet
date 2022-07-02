import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { RegularText } from '../../components/typography'

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
        <View style={styles.inputText} testID={testID}>
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
  inputText: {
    padding: 15,
    marginTop: 0,
    marginBottom: 10,

    borderRadius: 10,
    backgroundColor: 'rgba(49, 60, 60, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,

    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.24,
    color: '#373f48',
  },
})
