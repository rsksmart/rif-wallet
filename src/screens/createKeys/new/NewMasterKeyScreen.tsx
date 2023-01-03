import { useMemo, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Trans } from 'react-i18next'
import { CompositeScreenProps } from '@react-navigation/native'

import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { colors } from '../../../styles/colors'
import { Arrow } from 'components/icons'
import { PaginationNavigator } from 'components/button/PaginationNavigator'
import { SLIDER_WIDTH, WINDOW_WIDTH } from '../../../ux/slides/Dimensions'
import { WordView } from './WordView'
import { sharedMnemonicStyles } from './styles'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'src/navigation/rootNavigator'
import { KeyManagementSystem } from 'lib/core'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.NewMasterKey>,
  RootStackScreenProps<rootStackRouteNames.CreateKeysUX>
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
        <Text style={styles.header}>
          <Trans>Your Master Key</Trans>
        </Text>
        <Text style={styles.subHeader}>
          <Trans>Swipe to reveal next part of the phrase</Trans>
        </Text>
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
    fontSize: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginLeft: 60,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  subHeader: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 60,
    marginBottom: 5,
    textAlign: 'left',
  },
})
