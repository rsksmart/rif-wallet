import { StyleSheet, View } from 'react-native'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'

interface IIconInformationalBox {
  avatar?: string
  title?: string
  description?: string
  buttonText?: string
  onPress?: () => void
  backgroundColor?: string
}

export const IconInformationalBox = ({
  avatar,
  title,
  description,
  buttonText,
  onPress,
  backgroundColor = sharedColors.inputInactive,
}: IIconInformationalBox) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {avatar ? (
        <AvatarIcon style={styles.marginBottom} value={avatar} size={80} />
      ) : null}

      {title ? (
        <Typography style={styles.marginBottom} type={'h3'}>
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography type={'body3'}>{description}</Typography>
      ) : null}
      {buttonText ? (
        <View style={styles.button}>
          <AppTouchable style={styles.button} onPress={onPress} width={50}>
            <Typography style={styles.buttonText} type={'body1'}>
              {buttonText}
            </Typography>
          </AppTouchable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonText: {
    textDecorationLine: 'underline',
  },
  marginBottom: {
    marginBottom: 10,
  },
})
