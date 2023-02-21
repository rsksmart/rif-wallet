import { StyleSheet, View } from 'react-native'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'
import { castStyle } from 'shared/utils'
import { sharedStyles } from 'shared/styles'

interface InfoBoxProps {
  avatar?: string
  title?: string
  description?: string
  buttonText?: string
  onPress?: () => void
  backgroundColor?: string
}

export const InfoBox = ({
  avatar,
  title,
  description,
  buttonText,
  onPress,
  backgroundColor = sharedColors.inputInactive,
}: InfoBoxProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {avatar ? (
        <AvatarIcon style={sharedStyles.marginBottom} value={avatar} size={80} />
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
        <AppTouchable style={styles.button} onPress={onPress} width={50}>
          <Typography style={styles.buttonText} type={'body1'}>
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
  })
})
