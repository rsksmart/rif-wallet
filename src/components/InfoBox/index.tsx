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
  backgroundColor?: string
  avatarBackgroundColor?: string
}

export const InfoBox = ({
  avatar,
  title,
  description,
  buttonText,
  onPress,
  backgroundColor = sharedColors.inputInactive,
  avatarBackgroundColor = sharedColors.qrColor,
}: InfoBoxProps) => {
  const [isHidden, setIsHidden] = useState(false)
  const handleOnPress = useCallback(() => {
    // If onPress exists run it, else hide
    if (onPress) {
      onPress()
      return
    }
    setIsHidden(true)
    return
  }, [onPress])

  const shouldHide = isHidden ? styles.shouldHide : {}
  return (
    <View style={[styles.container, { backgroundColor }, shouldHide]}>
      {avatar ? (
        <Avatar
          style={[
            sharedStyles.marginBottom,
            { backgroundColor: avatarBackgroundColor },
          ]}
          name={avatar}
          size={80}
        />
      ) : null}

      {title ? (
        <Typography style={sharedStyles.marginBottom} type={'h3'}>
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography type={'body3'}>{description}</Typography>
      ) : null}
      {buttonText ? (
        <AppTouchable style={styles.button} onPress={handleOnPress} width={50}>
          <Typography style={styles.buttonText} type={'body2'}>
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
