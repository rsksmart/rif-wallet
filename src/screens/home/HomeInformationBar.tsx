import { ReactElement, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'

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
  const carousel = useRef<ICarouselInstance>(null)
  const onNextItem = () => {
    carousel?.current?.scrollTo({ count: 1, animated: true })
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
            ref={carousel}
            onSnapToItem={index => setSelectedSlide(index)}
            data={slidesIndexes}
            renderItem={({ item }) => items[item]}
            width={WINDOW_WIDTH - 88}
            height={72}
            loop={false}
            scrollAnimationDuration={250}
          />
        </View>
        <View style={styles.options}>
          <View style={styles.dotContainer}>
            {slidesIndexes.map((_, i) => {
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    selectedSlide >= i ? null : styles.dotInactive,
                  ]}
                />
              )
            })}
          </View>
          <AppTouchable
            onPress={selectedSlide === lastIndex ? onClose : onNextItem}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  }),
  rounded: castStyle.view({
    borderRadius: 10,
  }),
  dotContainer: castStyle.view({
    flexDirection: 'row',
  }),
  dot: castStyle.view({
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    backgroundColor: sharedColors.white,
  }),
  dotInactive: castStyle.view({
    opacity: 0.3,
  }),
  container: castStyle.view({
    margin: 24,
  }),
  space: castStyle.view({
    marginTop: 10,
  }),
  carouselContainer: castStyle.view({
    paddingVertical: 20,
    paddingHorizontal: 20,
  }),
  pagination: castStyle.view({
    paddingVertical: 5,
    paddingHorizontal: 0,
  }),
})
