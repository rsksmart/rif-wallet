import { Image, StyleSheet, View } from 'react-native'
import { RegularText, SemiBoldText } from 'src/components'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { SLIDER_WIDTH, WINDOW_HEIGHT } from './Dimensions'

const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.5)
export const SecondarySlide = ({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: Image
}) => (
  <View style={styles.itemContainer}>
    {image}
    <View style={{ ...grid.row, ...styles.center }}>
      <SemiBoldText style={styles.title}>{title}</SemiBoldText>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <RegularText style={styles.description}>{description}</RegularText>
    </View>
  </View>
)
const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 20,
    paddingBottom: 10,
  },
  description: {
    color: colors.white,
    fontSize: 19,
  },
  center: {
    alignSelf: 'center',
  },
  row: {
    marginVertical: 10,
  },
  itemContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
})
