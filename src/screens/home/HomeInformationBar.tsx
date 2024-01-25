import { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import Icon from 'react-native-vector-icons/Ionicons'
import Dots from 'react-native-dots-pagination'

import { WINDOW_WIDTH, noop, sharedColors } from 'shared/constants'
import { Typography } from 'components/typography'
import { AppTouchable } from 'components/appTouchable'
import { castStyle } from 'shared/utils'

import { HomeInformationItem } from './HomeInformationItem'

interface HomeInformationBarProps {
  onClose?: () => void
  color?: string
}

export const HomeInformationBar = ({
  onClose = noop,
  color = sharedColors.primary,
}: HomeInformationBarProps) => {
  const slidesIndexes = [0, 1, 2]
  const indicatorPos = [1 / 5, 6 / 7, 0]
  const lastIndex = slidesIndexes[slidesIndexes.length - 1]
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const carousel = useRef<ICarouselInstance>(null)

  const onNextItem = useCallback(() => {
    carousel.current?.scrollTo({ count: 1, animated: true })
  }, [])

  const { t } = useTranslation()
  const items = useMemo(
    () => [
      <HomeInformationItem
        title={t('home_information_bar_title')}
        subTitle={t('home_information_bar_desc1')}
      />,
      <HomeInformationItem
        title={t('home_information_bar_title')}
        subTitle={t('home_information_bar_desc2')}
      />,
      <HomeInformationItem
        title={t('home_information_bar_title')}
        subTitle={t('home_information_bar_desc3')}
        icon={
          <Icon
            name="person-circle-sharp"
            size={60}
            color={sharedColors.white}
          />
        }
      />,
    ],
    [t],
  )

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            marginLeft: indicatorPos[selectedSlide] * (WINDOW_WIDTH - 88),
            borderBottomColor: color,
          },
          selectedSlide === lastIndex ? styles.space : styles.triangle,
        ]}
      />
      <View style={[styles.carouselContainer, { backgroundColor: color }]}>
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
        <View style={styles.options}>
          <Dots
            length={3}
            active={selectedSlide}
            activeColor={sharedColors.white}
            activeDotWidth={8}
            activeDotHeight={8}
            passiveColor={sharedColors.primaryDark}
            passiveDotHeight={8}
            passiveDotWidth={8}
            paddingHorizontal={0}
          />
          <AppTouchable
            onPress={selectedSlide === lastIndex ? onClose : onNextItem}
            width={36}>
            <Typography type={'body3'}>
              {selectedSlide === lastIndex ? t('close') : t('next')}
            </Typography>
          </AppTouchable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    margin: 24,
  }),
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
  space: castStyle.view({
    marginTop: 10,
  }),
  carouselContainer: castStyle.view({
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
  }),
})
