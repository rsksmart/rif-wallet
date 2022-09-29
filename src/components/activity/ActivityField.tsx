import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText } from '../typography'
import { spacing } from '../../styles'

type ActivityFieldType = {
  title: string
  children: any
}

const ActivityField: React.FC<ActivityFieldType> = ({ title, children }) => {
  return (
    <View style={styles.fieldContainer}>
      <MediumText style={spacing.pl10}>{title}</MediumText>
      <View style={styles.wrapper}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#c6ccea',
    height: 70,
    borderRadius: 17,
    justifyContent: 'center',
    paddingLeft: 20,
    // paddingRight: 10,
    marginTop: 7,
    // marginHorizontal: 25,
  },
  fieldContainer: {
    marginBottom: 20,
  },
})
export default ActivityField
