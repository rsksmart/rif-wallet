import Clipboard from '@react-native-clipboard/clipboard'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { sharedColors, sharedStyles } from 'src/shared/constants'
import { castStyle } from 'shared/utils'

import { colors } from '../../styles'
import ContentCopyMaterialIcon from '../icons/ContentCopyMaterialIcon'
import { Typography } from '../typography'
import { useGlobalErrorContext } from './GlobalErrorHandlerContext'
import { AppButton } from '../button'

export type GlobalErrorHandlerViewType = {
  message?: string | undefined
}

const GlobalErrorHandlerView: React.FC<GlobalErrorHandlerViewType> = ({
  message,
}) => {
  const { handleReload, globalError } = useGlobalErrorContext()
  const { t } = useTranslation()
  const messageToShow: string = message || globalError || ''

  const onCopyError = React.useCallback(() => {
    Clipboard.setString(messageToShow)
  }, [messageToShow])
  return (
    <View style={styles.container}>
      <View style={styles.firstView}>
        <Image
          source={require('../../images/error-image.png')}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      </View>
      <View style={styles.secondView}>
        <View style={styles.textView}>
          <Typography type={'h1'} style={styles.text}>
            {t('global_error_title')}
          </Typography>
          <Typography type={'body1'} style={styles.text}>
            {t('global_error_subtitle')}
          </Typography>
        </View>
        {messageToShow !== '' && (
          <View style={sharedStyles.flex}>
            <Typography
              type={'body2'}
              color={sharedColors.white}
              style={styles.errorDetailsText}>
              {t('global_error_details_title')}
            </Typography>

            <TouchableOpacity
              style={styles.errorDetailsTouch}
              onPress={onCopyError}>
              <Typography
                type={'body3'}
                color={sharedColors.white}
                style={sharedStyles.flex}>
                {t(messageToShow)}
              </Typography>
              <ContentCopyMaterialIcon color={sharedColors.white} size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.reloadButtonView}>
          <AppButton
            title={'reload'}
            accessibilityLabel={'reload'}
            onPress={handleReload}
            style={styles.reload}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkPurple3,
    paddingHorizontal: 40,
  }),
  firstView: castStyle.view({
    flex: 0.8,
    justifyContent: 'flex-end',
  }),
  secondView: castStyle.view({
    flex: 1,
    width: '100%',
  }),
  imageView: castStyle.view({
    flex: 3,
    justifyContent: 'flex-end',
  }),
  textView: castStyle.view({
    flex: 1,
    justifyContent: 'center',
  }),
  reloadButtonView: castStyle.view({
    flex: 1,
    alignItems: 'center',
  }),
  text: castStyle.text({
    color: sharedColors.white,
    marginBottom: 10,
    textAlign: 'center',
  }),
  errorDetailsTouch: castStyle.view({
    backgroundColor: colors.darkPurple5,
    height: 65,
    borderRadius: 17,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }),
  errorDetailsText: castStyle.text({
    left: 16,
    fontSize: 10,
    marginBottom: 4,
  }),
  exclamation: castStyle.text({
    fontSize: 32,
  }),
  imageStyle: castStyle.image({
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  }),
  reload: castStyle.view({
    backgroundColor: colors.background.bustyBlue,
    width: 150,
  }),
})

export default GlobalErrorHandlerView
