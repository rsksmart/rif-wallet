import { ReactElement, useMemo } from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageSourcePropType,
  ColorValue,
} from 'react-native'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { fonts } from '../typography'

interface Props {
  size: number
  name: string
  icon?: ReactElement
  imageSource?: ImageSourcePropType
  style?: StyleProp<ViewStyle>
  letterColor?: ColorValue
}

export const Avatar = ({
  imageSource,
  icon,
  style,
  size,
  name,
  letterColor,
}: Props) => {
  const halfSize = useMemo(() => size / 2, [size])
  const firstCapital = useMemo(() => {
    const letters = name.split('')
    if (letters.length) {
      return letters[0].toUpperCase()
    }
    return ''
  }, [name])

  return (
    <View
      style={[
        styles.mainContainer,
        { height: size, width: size, borderRadius: halfSize },
        style,
      ]}>
      {(!icon && !imageSource) || (icon && imageSource) ? (
        <Text
          style={[
            styles.letter,
            {
              fontSize: halfSize,
              color: letterColor ? letterColor : sharedColors.white,
            },
          ]}>
          {firstCapital}
        </Text>
      ) : null}
      {icon && !imageSource ? icon : null}
      {!icon && imageSource ? (
        <Image
          source={imageSource}
          resizeMethod={'resize'}
          resizeMode={'center'}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: sharedColors.primary,
    overflow: 'hidden',
  }),
  letter: castStyle.text({
    ...fonts.regular,
  }),
})
