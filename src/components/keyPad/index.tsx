import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { DialButton } from '../button/DialButton'
import { grid } from '../../styles'
import { Arrow } from '../icons'

type Props = {
  onKeyPress: (value: string) => void
  onDelete: () => void
  onUnlock?: () => void
}

export const KeyPad: React.FC<Props> = ({ onDelete, onKeyPress }) => {
  return (
    <View style={{ ...grid.row, ...styles.root }}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View
          key={index}
          style={{
            ...grid.column4,
            ...styles.keyWrapper,
          }}>
          <DialButton
            label={`${index + 1}`}
            testID={`keypad_${index + 1}`}
            onPress={() => onKeyPress(`${index + 1}`)}
          />
        </View>
      ))}
      <View
        style={{
          ...grid.column4,
          ...styles.keyWrapper,
        }}
      />
      <View
        style={{
          ...grid.column4,
          ...styles.keyWrapper,
        }}>
        <DialButton
          label="0"
          testID="keypad_0"
          variant="default"
          onPress={() => onKeyPress('0')}
        />
      </View>
      <TouchableOpacity
        style={{
          ...grid.column4,
          ...styles.backButton,
        }}
        onPress={onDelete}
        testID="keypad_DEL">
        <Arrow color="white" rotate={270} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flexWrap: 'wrap',
  },
  keyWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 6.5,
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
  },
})
