import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'

type ITitleStatus = {
  title: string
  subTitle: string
  progress?: number
  progressText?: string
}
const TitleStatus: React.FC<ITitleStatus> = ({ title, subTitle }) => (
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <MediumText style={styles.titleText}>{title}</MediumText>
      <MediumText style={styles.subTitleText}>{subTitle}</MediumText>
    </View>
  </View>
)

export default TitleStatus
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 23,
    color: colors.white,
  },
  subTitleText: {
    color: colors.gray,
  },
  progress: {
    marginTop: 5,
  },
  progressText: { color: colors.white, fontSize: 16 },
})
