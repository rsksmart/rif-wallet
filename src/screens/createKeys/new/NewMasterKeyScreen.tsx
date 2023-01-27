import { CompositeScreenProps } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { KeyManagementSystem } from 'lib/core'

import { PaginationNavigator } from 'components/button/PaginationNavigator'
import { Arrow } from 'components/icons'
import { RegularText, SemiBoldText } from 'components/index'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { colors } from 'src/styles/colors'
import { SLIDER_WIDTH, WINDOW_WIDTH } from 'src/ux/slides/Dimensions'
import { WordView } from './WordView'
import { sharedMnemonicStyles } from './styles'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.NewMasterKey>,
  RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
>

export const NewMasterKeyScreen = ({ navigation }: Props) => {
  const mnemonic = useMemo(() => KeyManagementSystem.create().mnemonic, [])
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [carousel, setCarousel] = useState<Carousel<number>>()

  const slidesIndexes = Array.from(
    { length: Math.ceil(mnemonicArray.length / 3) },
    (_, i) => i,
  )

  const renderItem = ({ item }: { item: number }) => {
    const wordIndex = 3 * item
    return (
      <View>
        <WordView number={wordIndex + 1} text={mnemonicArray[wordIndex]} />
        <WordView number={wordIndex + 2} text={mnemonicArray[wordIndex + 1]} />
        <WordView number={wordIndex + 3} text={mnemonicArray[wordIndex + 2]} />
      </View>
    )
  }

  return (
    <ScrollView style={sharedMnemonicStyles.parent}>
      <View style={sharedMnemonicStyles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate(createKeysRouteNames.CreateKeys)}
          style={styles.returnButton}
          accessibilityLabel="backButton">
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
        <SemiBoldText style={styles.header}>
          <Trans>Your Master Key</Trans>
        </SemiBoldText>
        <RegularText style={styles.subHeader}>
          <Trans>Swipe to reveal next part of the phrase</Trans>
        </RegularText>
      </View>

      <View style={sharedMnemonicStyles.sliderContainer}>
        <Carousel
          inactiveSlideOpacity={0}
          removeClippedSubviews={false} //https://github.com/meliorence/react-native-snap-carousel/issues/238
          ref={c => c && setCarousel(c)}
          data={slidesIndexes}
          renderItem={renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={SLIDER_WIDTH}
          inactiveSlideShift={0}
          onSnapToItem={index => setSelectedSlide(index)}
        />
      </View>

      <View style={sharedMnemonicStyles.pagnationContainer}>
        <PaginationNavigator
          onPrevious={() => carousel?.snapToPrev()}
          onNext={() => carousel?.snapToNext()}
          onComplete={() =>
            navigation.navigate(createKeysRouteNames.ConfirmNewMasterKey, {
              mnemonic,
            })
          }
          title="confirm"
          currentIndex={selectedSlide}
          slidesAmount={slidesIndexes.length}
          containerBackgroundColor={colors.darkBlue}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  returnButton: {
    zIndex: 1,
  },
  returnButtonView: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 15,
    backgroundColor: colors.purple,
  },

  header: {
    color: colors.white,
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 5,
    marginLeft: 60,
    textAlign: 'left',
  },
  subHeader: {
    color: colors.white,
    marginLeft: 60,
    marginBottom: 5,
    textAlign: 'left',
  },
})
