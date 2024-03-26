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
  name?: string
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
    if (name) {
      const letters = name.split('')
      if (letters.length) {
        return letters[0].toUpperCase()
      }
    }
    return ''
  }, [name])

  const backgroundColor =
    icon || imageSource ? 'transparent' : sharedColors.primary

  return (
    <View
      style={[
        styles.mainContainer,
        { height: size, width: size, borderRadius: halfSize, backgroundColor },
        style,
      ]}>
      {(!icon && !imageSource) || (icon && imageSource) ? (
        <Text
          style={[
            fonts.regular,
            {
              fontSize: halfSize,
              color: letterColor || sharedColors.text.primary,
            },
          ]}>
          {firstCapital}
        </Text>
      ) : null}
      {icon && !imageSource ? icon : null}
      {!icon && imageSource ? (
        <Image style={{ height: size, width: size }} source={imageSource} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }),
})
