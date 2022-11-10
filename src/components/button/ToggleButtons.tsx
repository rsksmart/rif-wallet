import React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../../styles'
import { MediumText, RegularText } from '../typography'
import BaseButton from './BaseButton'

export interface Props {
  label: string
  options: string[]
  selectedOption: string
  onOptionSelected: (option: string) => void
}

export const ToggleButtons: React.FC<Props> = ({
  label,
  options,
  selectedOption,
  onOptionSelected,
}) => (
  <>
    <RegularText style={styles.label}>{label}</RegularText>
    <View style={styles.options}>
      {options.map((option, index) => {
        const optionStyle =
          selectedOption === option
            ? { ...styles.option, ...styles.selectedOption }
            : styles.option

        if (index === 0) {
          optionStyle.marginRight = 5
        } else if (index === options.length - 1) {
          optionStyle.marginLeft = 5
        } else {
          optionStyle.marginHorizontal = 5
        }

        const optionTextStyle =
          option === selectedOption
            ? { ...styles.text, ...styles.selectedText }
            : styles.text

        return (
          <BaseButton
            key={option}
            style={optionStyle}
            onPress={() => onOptionSelected(option)}>
            <MediumText style={optionTextStyle}>{option}</MediumText>
          </BaseButton>
        )
      })}
    </View>
  </>
)

const styles = StyleSheet.create({
  label: {
    color: colors.lightPurple,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    height: 50,
  },
  option: {
    flex: 1,
    backgroundColor: colors.darkPurple4,
    borderRadius: 10,
    marginLeft: 0,
    marginRight: 0,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.lightPurple,
  },
  text: {
    color: colors.lightPurple,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.darkPurple3,
  },
})
