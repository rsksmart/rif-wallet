import { ReactChild } from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText } from '../typography'
import { spacing } from '../../styles'

interface ActivityFieldProps {
  title: string
  children: ReactChild
}

const ActivityField = ({ title, children }: ActivityFieldProps) => {
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
