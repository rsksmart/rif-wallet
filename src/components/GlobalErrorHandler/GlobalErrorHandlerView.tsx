import Clipboard from '@react-native-community/clipboard'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { colors } from '../../styles'
import { PrimaryButton } from '../button/PrimaryButton'
import ContentCopyMaterialIcon from '../icons/ContentCopyMaterialIcon'
import { RegularText, SemiBoldText } from '../typography'
import { useGlobalErrorContext } from './GlobalErrorHandlerContext'

export type GlobalErrorHandlerViewType = {
  message?: string | undefined
}

const GlobalErrorHandlerView: React.FC<GlobalErrorHandlerViewType> = ({
  message,
}) => {
  const { handleReload, globalError } = useGlobalErrorContext()
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
          <SemiBoldText style={styles.text}>
            Oops... Something went wrong!
          </SemiBoldText>
          <RegularText style={styles.text}>
            We are working hard to fix it.
          </RegularText>
        </View>
        {messageToShow !== '' && (
          <View style={styles.errorDetailsView}>
            <RegularText style={[styles.errorDetailsText, styles.whiteText]}>
              error details
            </RegularText>

            <TouchableOpacity
              style={styles.errorDetailsTouch}
              onPress={onCopyError}>
              <RegularText style={[styles.whiteText, styles.detailsText]}>
                {messageToShow}
              </RegularText>
              <ContentCopyMaterialIcon color="white" size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.reloadButtonView}>
          <PrimaryButton
            title="reload"
            accessibilityLabel="reload"
            onPress={handleReload}
            style={styles.reload}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkPurple3,
    paddingHorizontal: 40,
  },
  firstView: {
    flex: 0.8,
    justifyContent: 'flex-end',
  },
  secondView: {
    flex: 1,
    width: '100%',
  },
  imageView: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
  },
  errorDetailsView: {
    flex: 1,
  },
  reloadButtonView: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetailsTouch: {
    backgroundColor: colors.darkPurple5,
    height: 65,
    borderRadius: 17,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  errorDetailsText: {
    left: 16,
    fontSize: 10,
    marginBottom: 4,
  },
  whiteText: {
    color: 'white',
  },
  detailsText: {
    flex: 1,
  },
  exclamation: {
    fontSize: 32,
  },
  imageStyle: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  reload: {
    backgroundColor: colors.background.bustyBlue,
    width: 150,
  },
})

export default GlobalErrorHandlerView
