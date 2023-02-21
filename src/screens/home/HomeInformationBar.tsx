import { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { useTranslation } from 'react-i18next'

import { noop, sharedColors } from 'shared/constants'
import { Typography } from 'components/typography'
import { AppTouchable } from 'components/appTouchable'
import { WINDOW_WIDTH } from 'src/ux/slides/Dimensions'
import { castStyle } from 'shared/utils'

interface HomeInformationBarProps {
  slidesIndexes: number[]
  indicatorPos: number[]
  items: ReactElement[]
  onClose?: () => void
  color?: string
}

export const HomeInformationBar = ({
  slidesIndexes,
  indicatorPos,
  items,
  onClose = noop,
  color = sharedColors.primary,
}: HomeInformationBarProps) => {
  const lastIndex = slidesIndexes[slidesIndexes.length - 1]
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [caoursel, setCarousel] = useState<Carousel<number> | null>(null)
  const onNextItem = () => {
    caoursel?.snapToNext()
    setSelectedSlide(caoursel?.currentIndex || 0)
  }
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
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
        <View style={styles.space} />
      )}
      <View
        style={[
          styles.rounded,
          {
            backgroundColor: color,
          },
        ]}>
        <View style={styles.carouselContainer}>
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
        <View style={styles.options}>
          <Pagination
            dotsLength={slidesIndexes.length}
            activeDotIndex={selectedSlide}
            containerStyle={styles.pagination}
            dotStyle={styles.dot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
          <AppTouchable
            style={styles.option}
            onPress={
              selectedSlide === lastIndex ? () => onClose() : () => onNextItem()
            }
            width={36}>
            <Typography type={'h4'}>
              {selectedSlide === lastIndex ? t('close') : t('next')}
            </Typography>
          </AppTouchable>
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
    paddingBottom: 10,
    paddingLeft: 10,
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
  container: castStyle.view({
    margin: 20,
  }),
  space: castStyle.view({
    marginTop: 10,
  }),
  carouselContainer: castStyle.view({
    paddingVertical: 20,
  }),
  pagination: castStyle.view({
    paddingVertical: 5,
    paddingHorizontal: 0,
  }),
  option: castStyle.view({
    marginRight: 10,
  }),
})
