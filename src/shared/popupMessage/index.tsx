import { StyleSheet } from 'react-native'
import { MessageOptions, hideMessage } from 'react-native-flash-message'

import { AppTouchable, Typography, typographyStyles } from 'components/index'

import { sharedColors } from '../constants'
import { castStyle } from '../utils'

export const getPopupMessage = (
  message: string,
  actionTitle?: string,
  onPress?: () => void,
): MessageOptions => {
  const executePress = () => {
    onPress?.()
    hideMessage()
  }

  return {
    message,
    style: {
      justifyContent: 'center',
      backgroundColor: sharedColors.primary,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    titleStyle: {
      ...typographyStyles.body3,
      textAlign: 'center',
    },
    renderAfterContent: () =>
      actionTitle ? (
        <AppTouchable
          width={150}
          style={styles.textLink}
          onPress={executePress}>
          <Typography style={styles.text} type={'h4'}>
            {actionTitle}
          </Typography>
        </AppTouchable>
      ) : null,
    duration: 6000,
  }
}

const styles = StyleSheet.create({
  textLink: castStyle.view({
    marginTop: 6,
    alignSelf: 'center',
  }),
  text: castStyle.text({ textDecorationLine: 'underline' }),
})
