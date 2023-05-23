import { useTranslation } from 'react-i18next'
import { useCallback, useMemo, useState } from 'react'
import { TextStyle } from 'react-native'

import { sharedColors } from 'shared/constants'
import { Input, InputProps } from 'components/input'

export interface ContactInputProps extends InputProps {
  onChangeName: (newValue: string) => void
  min: number
  max: number
}

enum Status {
  READY = 'READY',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const typeColorMap = new Map([
  [Status.ERROR, sharedColors.danger],
  [Status.SUCCESS, sharedColors.success],
  [Status.INFO, sharedColors.inputLabelColor],
])

const defaultStatus = { type: Status.READY, value: '' }

export const ContactInput = ({
  resetValue,
  label,
  inputName,
  testID,
  accessibilityLabel,
  placeholder,
  onChangeName,
  min,
  max,
}: ContactInputProps) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState<{
    type: Status
    value?: string
  }>({ type: Status.READY })

  const labelColor = useMemo<TextStyle>(() => {
    return typeColorMap.get(status.type)
      ? { color: typeColorMap.get(status.type) }
      : { color: typeColorMap.get(Status.INFO) }
  }, [status.type])

  const handleChangeText = useCallback(
    (inputText: string) => {
      if (inputText.length === 0) {
        setStatus(defaultStatus)
      }

      onChangeName(inputText)

      if (!inputText) {
        return
      }

      if (inputText.length < min) {
        setStatus({
          type: Status.ERROR,
          value: t('contact_form_invalid_short_name'),
        })
      }
      if (inputText.length > max) {
        setStatus({
          type: Status.ERROR,
          value: t('contact_form_invalid_long_name'),
        })
      }
      if (inputText.length >= min && inputText.length <= max) {
        setStatus({
          type: Status.INFO,
          value: t('contact_form_name'),
        })
      }
    },
    [onChangeName, t, max, min],
  )

  return (
    <>
      <Input
        label={status.value ? status.value : label}
        labelStyle={labelColor}
        inputName={inputName}
        testID={testID}
        autoCorrect={false}
        autoCapitalize={'none'}
        onChangeText={handleChangeText}
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={sharedColors.inputLabelColor}
        resetValue={resetValue}
      />
    </>
  )
}
