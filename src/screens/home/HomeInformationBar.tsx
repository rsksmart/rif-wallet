import { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { sharedColors } from 'shared/constants'
import { Typography } from 'src/components'
import { AppTouchable } from 'components/appTouchable'
import { WINDOW_WIDTH } from 'src/ux/slides/Dimensions'
import { castStyle } from 'shared/utils'

type HomeInformationBarProps = {
  slidesIndexes: number[]
  indicatorPos: number[]
  items: ReactElement[]
  color?: string
}

export const HomeInformationBar = ({
  slidesIndexes,
  indicatorPos,
  items,
  color = sharedColors.primary,
}: HomeInformationBarProps) => {
  const lastIndex = slidesIndexes[slidesIndexes.length - 1]
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [caoursel, setCarousel] = useState<Carousel<number> | null>(null)
  const onNextItem = () => {
    caoursel?.snapToNext()
    setSelectedSlide(caoursel?.currentIndex || 0)
  }

  return (
    <View style={styles.m20}>
      {selectedSlide !== lastIndex ? (
        <View
          style={[
            styles.triangle,
            {
              marginLeft: indicatorPos[selectedSlide] * WINDOW_WIDTH,
              borderBottomColor: color,
            },
          ]}
        />
      ) : (
        <View style={styles.mt10} />
      )}
      <View
        style={[
          styles.rounded,
          {
            backgroundColor: color,
          },
        ]}>
        <View style={styles.pv20}>
          <Carousel
            inactiveSlideOpacity={0}
            ref={c => setCarousel(c)}
            onSnapToItem={index => setSelectedSlide(index)}
            data={slidesIndexes}
            renderItem={({ item }) => items[item]}
            sliderWidth={WINDOW_WIDTH - 40}
            itemWidth={WINDOW_WIDTH - 40}
            inactiveSlideShift={0}
          />
        </View>
        <View style={[styles.options, styles.pb10, styles.pl10]}>
          <View style={{}}>
            <Pagination
              dotsLength={slidesIndexes.length}
              activeDotIndex={selectedSlide}
              containerStyle={[styles.pv5, styles.ph0]}
              dotStyle={styles.dot}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              tappableDots={true}
            />
          </View>
          <View style={styles.mr10}>
            <AppTouchable onPress={onNextItem} width={36}>
              <Typography type={'h4'}>
                {selectedSlide === lastIndex ? 'Close' : 'Next'}
              </Typography>
            </AppTouchable>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  triangle: castStyle.view({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  }),
  options: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  rounded: castStyle.view({
    borderRadius: 10,
  }),
  dot: castStyle.view({
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  }),
  m20: castStyle.view({
    margin: 20,
  }),
  mt10: castStyle.view({
    marginTop: 10,
  }),
  pv20: castStyle.view({
    paddingVertical: 20,
  }),
  pb10: castStyle.view({
    paddingBottom: 10,
  }),
  pl10: castStyle.view({
    paddingLeft: 10,
  }),
  pv5: castStyle.view({
    paddingVertical: 5,
  }),
  ph0: castStyle.view({
    paddingHorizontal: 0,
  }),
  mr10: castStyle.view({
    marginRight: 10,
  }),
})
