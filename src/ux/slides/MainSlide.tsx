import { grid } from '../../styles/grid'
import { StyleSheet, View, Text, Image } from 'react-native'
import { colors } from '../../styles/colors'
import { WINDOW_HEIGHT, SLIDER_WIDTH } from './Dimensions'

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
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.subTitle}>{subTitle}</Text>
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
