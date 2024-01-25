import { ColorValue, StyleSheet, Text, TextProps } from 'react-native'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

export const fonts = StyleSheet.create({
  regular: castStyle.text({
    fontFamily: 'Sora-Regular',
    fontWeight: '500',
    color: sharedColors.white,
  }),
})

const styles = StyleSheet.create({
  h1: castStyle.text({
    ...fonts.regular,
    fontSize: 36,
    lineHeight: 39,
  }),
  h2: castStyle.text({
    ...fonts.regular,
    fontSize: 24,
    lineHeight: 28.8,
  }),
  h3: castStyle.text({
    ...fonts.regular,
    fontSize: 18,
    lineHeight: 21.6,
  }),
  h4: castStyle.text({
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 16.8,
  }),
  h5: castStyle.text({
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 14.4,
  }),
  body1: castStyle.text({
    ...fonts.regular,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '400',
  }),
  body2: castStyle.text({
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
  }),
  body3: castStyle.text({
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 16.8,
    fontWeight: '400',
  }),
  label: castStyle.text({
    ...fonts.regular,
    fontSize: 11,
    lineHeight: 11,
  }),
  button1: castStyle.text({
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 14,
  }),
  button2: castStyle.text({
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 12,
  }),
  labelLight: castStyle.text({
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
  }),
})

export type TypographyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'label'
  | 'button1'
  | 'button2'
  | 'labelLight'

interface Props extends TextProps {
  type: TypographyType
  color?: ColorValue
}

const typeStyleMap = new Map([
  ['h1', styles.h1],
  ['h2', styles.h2],
  ['h3', styles.h3],
  ['h4', styles.h4],
  ['h5', styles.h5],
  ['body1', styles.body1],
  ['body2', styles.body2],
  ['body3', styles.body3],
  ['label', styles.label],
  ['button1', styles.button1],
  ['button2', styles.button2],
  ['labelLight', styles.labelLight],
])

export const Typography = ({
  style,
  color,
  type,
  children,
  ...props
}: Props) => {
  return (
    <Text
      style={[typeStyleMap.get(type), color ? { color } : null, style]}
      {...props}>
      {children}
    </Text>
  )
}

export { styles as typographyStyles }
