import React from 'react'
import { StyleSheet, View } from 'react-native'
import PinConnector from '../PinConnector'
import PinDotsRenderer from './PinDotsRenderer'
import { DotsComponentDefaultType } from './PinScreen'

const DotsComponentDefault: React.FC<DotsComponentDefaultType> = ({ pin }) => {
  return (
    <View style={styles.dotsWrapper}>
      {pin.map((digit, index, arr) => (
        <View style={styles.flexContainer} key={`${digit}${index}`}>
          <PinConnector.Container>
            <PinDotsRenderer index={index} digit={digit} arr={arr} />
          </PinConnector.Container>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  dotsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    marginBottom: 80,
  },
  flexContainer: {
    flex: 1,
  },
})
export default DotsComponentDefault
