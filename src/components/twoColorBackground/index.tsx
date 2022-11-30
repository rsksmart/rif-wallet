import { StyleSheet, View, Text } from 'react-native'

const TwoColorBackground = () => (
  <View style={styles.container}>
    <View style={styles.leftContainer} />
    <View style={styles.rightContainer} />
    <View style={styles.buttonContainer}>
      <Text style={styles.text}>Hello World</Text>
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
