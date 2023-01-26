import { Image, StyleSheet, View } from 'react-native'
import { RegularText } from 'src/components'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { SLIDER_WIDTH, WINDOW_HEIGHT } from './Dimensions'

const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.5)
export const MainSlide = ({
  title,
  subTitle,
  image,
}: {
  title: string
  subTitle: string
  image: Image
}) => (
  <View style={styles.itemContainer}>
    {image}
    <View style={{ ...grid.row, ...styles.center }}>
      <RegularText style={styles.title}>{title}</RegularText>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <RegularText style={styles.subTitle}>{subTitle}</RegularText>
    </View>
  </View>
)
const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  subTitle: {
    color: colors.white,
    fontSize: 40,
  },
  center: {
    alignSelf: 'center',
  },
  itemContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
})
