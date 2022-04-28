import { colors } from '../../styles/colors'
import { Pagination } from 'react-native-snap-carousel'

import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native'
import { Arrow } from '../icons'
import { CheckIcon } from '../icons/CheckIcon'

interface Interface {
  title?: string
  icon?: any
  onPrevious: (event: GestureResponderEvent) => any
  onNext?: (event: GestureResponderEvent) => any
  onComplete?: (event: GestureResponderEvent) => any
  currentIndex: number
  disabled?: boolean
  testID?: string
  shadowColor?: string
  backgroundColor?: string
  slidesAmount: number
}

export const PaginationNavigator: React.FC<Interface> = ({
  onPrevious,
  onNext,
  onComplete,
  currentIndex,
  disabled,
  shadowColor,
  backgroundColor = 'white',
  slidesAmount,
}) => {
  const imageStyle = {
    ...styles.image,
    shadowColor,
    backgroundColor,
  }
  const slidePages = [...Array(slidesAmount).keys()] // create an array containing 1...slidesAmount
  const pagination = (index: number, entries: number[]) => {
    const activeSlide = index
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonLeft}
        onPress={onPrevious}
        disabled={disabled}>
        <View style={imageStyle}>
          <Arrow color={colors.blue} rotate={270} width={50} height={50} />
        </View>
      </TouchableOpacity>
      <View>{pagination(currentIndex, slidePages)}</View>

      {currentIndex < slidesAmount - 1 && (
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onNext}
          disabled={disabled}>
          <View style={imageStyle}>
            <Arrow color={colors.blue} rotate={90} width={50} height={50} />
          </View>
        </TouchableOpacity>
      )}
      {currentIndex === slidesAmount - 1 && (
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onComplete}
          disabled={disabled}>
          <View style={{ ...imageStyle, backgroundColor: colors.green }}>
            <CheckIcon color={colors.blue} width={50} height={50} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    color: colors.white,
    height: 65,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 60,
  },
  buttonLeft: {
    padding: 10,
    flexDirection: 'row',
  },
  buttonRight: {
    padding: 10,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 15,
  },
  text: {
    paddingTop: 8,
    color: colors.white,
  },
  textDisabled: {
    color: '#cccccc',
  },
  paginationContainer: { backgroundColor: colors.blue },
  dotStyle: {
    width: 10,
    height: 10,
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
})
