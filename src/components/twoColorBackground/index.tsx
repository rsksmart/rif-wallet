import { StyleSheet, View } from 'react-native'
import { RegularText } from '../typography'

const TwoColorBackground = () => (
  <View style={styles.container}>
    <View style={styles.leftContainer} />
    <View style={styles.rightContainer} />
    <View style={styles.buttonContainer}>
      <RegularText style={styles.text}>Hello World</RegularText>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    backgroundColor: '#ca8afa',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#96d0e3',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'red',
  },
})

export default TwoColorBackground
