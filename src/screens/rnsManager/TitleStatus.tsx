import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'
import * as Progress from 'react-native-progress'

type ITitleStatus = {
  title: string
  subTitle: string
  progress: number
  progressText: string
}
const TitleStatus: React.FC<ITitleStatus> = ({
  title,
  subTitle,
  progress,
  progressText,
}) => (
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <MediumText style={styles.titleText}>{title}</MediumText>
      <MediumText style={styles.subTitleText}>{subTitle}</MediumText>
    </View>
    <Progress.Circle
      style={styles.progress}
      textStyle={styles.progressText}
      showsText={true}
      formatText={() => progressText}
      size={45}
      progress={progress}
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
    color: colors.lightPurple,
  },
  subTitleText: {
    color: colors.gray,
  },
  progress: {
    marginTop: 5,
  },
  progressText: { color: colors.lightPurple, fontSize: 16 },
})
