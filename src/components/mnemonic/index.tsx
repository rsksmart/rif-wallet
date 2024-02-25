import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppTouchable } from 'components/appTouchable'

import { AppButton, AppButtonWidthVarietyEnum } from '../button'
import { EyeIcon } from '../icons/EyeIcon'
import { Typography } from '../typography'

const iconSize = 28

interface Props {
  words: string[]
  showAdvice?: boolean
  onToggleMnemonic?: (visible: boolean) => void
  style?: StyleProp<ViewStyle>
}

interface MnemonicHiddenProps {
  titleText: string
  bodyText: string
}

const MnemonicAdviceComponent = ({
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
  showAdvice = true,
  onToggleMnemonic,
  style,
}: Props) => {
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false)
  const { t } = useTranslation()

  const onEyeIconPress = useCallback(() => {
    setIsMnemonicVisible(prev => {
      onToggleMnemonic && onToggleMnemonic(!prev)
      return !prev
    })
  }, [onToggleMnemonic])

  return (
    <View style={[styles.mainContainer, style]}>
      {!isMnemonicVisible && showAdvice ? (
        <MnemonicAdviceComponent
          titleText={t('mnemonic_title')}
          bodyText={t('mnemonic_body')}
        />
      ) : (
        <View
          style={styles.pillContainer}
          accessibilityLabel="mnemonic container">
          {words.map((word, index) => {
            const pillText = `${index + 1}.${word}`
            if (!isMnemonicVisible && index >= 12) {
              return null
            }
            return (
              <AppButton
                key={`${word + index}`}
                width={'auto'}
                style={styles.wordPill}
                textStyle={styles.wordPillText}
                textType={'body3'}
                title={pillText}
                textColor={
                  isMnemonicVisible
                    ? sharedColors.white
                    : sharedColors.inputActive
                }
                color={
                  isMnemonicVisible
                    ? sharedColors.primary
                    : sharedColors.inputActive
                }
                widthVariety={AppButtonWidthVarietyEnum.INLINE}
                accessibilityLabel={`${index}.${word}`}
              />
            )
          })}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <AppTouchable
          width={iconSize + 8}
          onPress={onEyeIconPress}
          accessibilityLabel="toggleVisibleButton">
          <EyeIcon isHidden={!isMnemonicVisible} size={iconSize} />
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
    backgroundColor: sharedColors.background.secondary,
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
    justifyContent: 'space-around',
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
