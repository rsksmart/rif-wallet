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
  testID?: string
  shadowColor?: string
  backgroundColor?: string
  containerBackgroundColor?: string
  slidesAmount: number
  completed?: boolean
}

export const PaginationNavigator: React.FC<Interface> = ({
  onPrevious,
  onNext,
  onComplete,
  currentIndex,
  shadowColor,
  backgroundColor = 'white',
  containerBackgroundColor = colors.blue,
  slidesAmount,
  completed = true,
}) => {
  const circleStyle = {
    ...styles.image,
    shadowColor,
    backgroundColor,
  }
  const circleStyleDisabled = {
    ...circleStyle,
    opacity: 0.5,
  }

  const slidePages = [...Array(slidesAmount).keys()] // create an array containing 1...slidesAmount
  const pagination = (index: number, entries: number[]) => {
    const activeSlide = index
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: containerBackgroundColor }}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: containerBackgroundColor,
      }}>
      <TouchableOpacity
        style={styles.buttonLeft}
        onPress={onPrevious}
        disabled={currentIndex === 0}>
        <View style={currentIndex !== 0 ? circleStyle : circleStyleDisabled}>
          <Arrow color={colors.blue} rotate={270} width={50} height={50} />
        </View>
      </TouchableOpacity>
      <View>{pagination(currentIndex, slidePages)}</View>

      {(currentIndex < slidesAmount - 1 || !completed) && (
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onNext}
          disabled={false}>
          <View style={circleStyle}>
            <Arrow color={colors.blue} rotate={90} width={50} height={50} />
          </View>
        </TouchableOpacity>
      )}
      {currentIndex === slidesAmount - 1 && completed && (
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onComplete}
          disabled={false}>
          <View style={{ ...circleStyle, backgroundColor: colors.green }}>
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
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 60,
  },
  buttonLeft: {
    padding: 0,
    paddingTop: 5,
    flexDirection: 'row',
  },
  buttonRight: {
    padding: 0,
    paddingTop: 5,
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
  dotStyle: {
    width: 6,
    height: 6,
    marginTop: 20,
    margin: 0,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
})
