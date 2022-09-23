import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'
import * as Progress from 'react-native-progress'

type ITitleStatus = {
  title: string
}
const format = (progress: number) => {
  return '1/5'
}
const TitleStatus: React.FC<ITitleStatus> = ({ title }) => (
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <MediumText style={styles.titleText}>{title} </MediumText>
      <MediumText style={styles.subTitleText}>
        next: Request Process{' '}
      </MediumText>
    </View>
    <Progress.Circle
      style={styles.progress}
      textStyle={styles.progressText}
      showsText={true}
      formatText={format}
      size={45}
      progress={0.3}
      indeterminate={false}
      color={colors.white}
      unfilledColor={colors.darkPurple}
      borderColor={colors.darkPurple}
    />
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
