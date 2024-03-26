import { StyleSheet, View } from 'react-native'
import { useCallback, useState } from 'react'

import { Typography } from 'components/typography'
import { AppTouchable } from 'components/appTouchable'
import { Avatar } from 'components/avatar'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { sharedStyles } from 'shared/styles'

interface InfoBoxProps {
  avatar?: string
  title?: string
  description?: string
  buttonText?: string
  onPress?: () => void
  textColor?: string
  backgroundColor?: string
  avatarBackgroundColor?: string
}

export const InfoBox = ({
  avatar,
  title,
  description,
  buttonText,
  onPress,
  textColor = sharedColors.text.primary,
  backgroundColor = sharedColors.primary,
  avatarBackgroundColor = sharedColors.text.secondary,
}: InfoBoxProps) => {
  const [shouldHide, setShouldHide] = useState(false)
  const handleOnPress = useCallback(() => {
    // If onPress exists run it, else hide
    if (onPress) {
      onPress()
      return
    }
    setShouldHide(true)
    return
  }, [onPress])

  const infoboxHiddenStyle = shouldHide ? styles.shouldHide : null
  return (
    <View style={[styles.container, { backgroundColor }, infoboxHiddenStyle]}>
      {avatar ? (
        <Avatar
          style={[
            sharedStyles.marginBottom,
            { backgroundColor: avatarBackgroundColor },
          ]}
          letterColor={textColor}
          name={avatar}
          size={80}
        />
      ) : null}

      {title ? (
        <Typography
          style={sharedStyles.marginBottom}
          type={'h3'}
          color={textColor}>
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography type={'body3'} color={textColor}>
          {description}
        </Typography>
      ) : null}
      {buttonText ? (
        <AppTouchable style={styles.button} onPress={handleOnPress} width={50}>
          <Typography
            style={styles.buttonText}
            type={'body2'}
            color={textColor}>
            {buttonText}
          </Typography>
        </AppTouchable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  }),
  button: castStyle.view({
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }),
  buttonText: castStyle.text({
    textDecorationLine: 'underline',
  }),
  shouldHide: castStyle.view({
    display: 'none',
  }),
})
