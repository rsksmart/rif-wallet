import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Clipboard from '@react-native-community/clipboard'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppTouchable } from '../appTouchable'
import { AppButton, AppButtonWidthVarietyEnum } from '../button'
import { EyeIcon } from '../icons/EyeIcon'
import { Typography } from '../typography'

const iconSize = 28

interface Props {
  words: string[]
  onToggleMnemonic?: (visible: boolean) => void
  style?: StyleProp<ViewStyle>
}

interface MnemonicHiddenProps {
  titleText: string
  bodyText: string
}

const MnemonicHiddenComponent = ({
  titleText,
  bodyText,
}: MnemonicHiddenProps) => {
  return (
    <View style={sharedStyles.contentCenter}>
      <Typography
        style={[sharedStyles.textCenter, styles.titleText]}
        type={'h3'}>
        {titleText}
      </Typography>
      <Typography
        style={[sharedStyles.textCenter, styles.bodyText]}
        type={'body3'}>
        {bodyText}
      </Typography>
    </View>
  )
}

export const MnemonicComponent = ({
  words,
  onToggleMnemonic,
  style,
}: Props) => {
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false)
  const { t } = useTranslation()
  const [title, setTitle] = useState(t('mnemonic_title'))
  const [body, setBody] = useState(t('mnemonic_body'))

  const onCopy = useCallback(async () => {
    const string = words.join(' ')
    Clipboard.setString(string)
    setTitle(t('mnemonic_title_copy'))
    setBody(t('mnemonic_body_copy'))
  }, [words, t])

  const onEyeIconPress = useCallback(() => {
    setIsMnemonicVisible(prev => {
      onToggleMnemonic && onToggleMnemonic(!prev)
      return !prev
    })
  }, [onToggleMnemonic])

  return (
    <View style={[styles.mainContainer, style]}>
      {!isMnemonicVisible ? (
        <MnemonicHiddenComponent titleText={title} bodyText={body} />
      ) : (
        <View style={styles.pillContainer} accessibilityLabel="mnemonic container">
          {words.map((word, index) => (
            <AppButton
              key={`${word + index}`}
              width={'auto'}
              style={styles.wordPill}
              textStyle={styles.wordPillText}
              textType={'body3'}
              title={`${index + 1}.${word}`}
              color={sharedColors.primary}
              widthVariety={AppButtonWidthVarietyEnum.INLINE}
              accessibilityLabel={`${index}.${word}`}
            />
          ))}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <AppTouchable
          width={iconSize + 8}
          onPress={onEyeIconPress}
          accessibilityLabel="toggleVisibleButton">
          <EyeIcon isHidden={!isMnemonicVisible} size={iconSize} />
        </AppTouchable>
        <AppTouchable
          width={iconSize}
          onPress={onCopy}
          accessibilityLabel="copyButton">
          <Icon name={'copy'} size={iconSize} color={sharedColors.white} />
        </AppTouchable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: castStyle.view({
    width: '100%',
    minHeight: 309,
    justifyContent: 'center',
    backgroundColor: sharedColors.inputInactive,
    padding: 20,
    borderRadius: 10,
  }),
  titleText: castStyle.text({
    marginTop: 98,
  }),
  bodyText: castStyle.text({
    height: 78,
    marginTop: 12,
    marginHorizontal: 20,
  }),
  buttonContainer: castStyle.view({
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  pillContainer: castStyle.view({
    flexDirection: 'row',
    flexWrap: 'wrap',
  }),
  wordPill: castStyle.view({
    marginTop: 12,
    marginRight: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  }),
  wordPillText: castStyle.text({
    letterSpacing: 0.3,
    textAlign: 'center',
  }),
})
