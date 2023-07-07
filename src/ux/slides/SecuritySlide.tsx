import { Image, StyleSheet, View } from 'react-native'

import { RegularText, SemiBoldText } from 'src/components'

import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { SLIDER_HEIGHT, SLIDER_WIDTH } from './Dimensions'

export const SecuritySlide = ({
  title,
  description,
  description2,
  image,
}: {
  title: string
  description: string
  description2: string
  image: Image
}) => (
  <View style={styles.slideContainer}>
    <View style={styles.imageContainer}>{image}</View>
    <View style={grid.row}>
      <SemiBoldText style={styles.title}>{title}</SemiBoldText>
    </View>
    <View style={grid.row}>
      <RegularText style={styles.description}>{description}</RegularText>
    </View>
    <View style={grid.row}>
      <SemiBoldText style={styles.description2}>{description2}</SemiBoldText>
    </View>
  </View>
)
const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 15,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 15,
  },
  description2: {
    color: colors.white,
    fontSize: 14,
  },
  slideContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
})
