import { View, StyleSheet } from 'react-native'
import Icons from 'react-native-vector-icons/AntDesign'
import { RegularText } from '../../components'
import { colors } from '../../styles'

export const ThankYouComponent = () => (
  <View style={styles.container}>
    <Icons name="checkcircle" size={60} color={colors.green} />
    <RegularText style={styles.text}>Thank You!</RegularText>
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    paddingVertical: 20,
  },
})
