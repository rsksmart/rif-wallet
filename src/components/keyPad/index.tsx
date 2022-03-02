import React from 'react'
import { StyleSheet, View } from 'react-native'

import { DialButton } from '../button/DialButton'
import { grid } from '../../styles/grid'

type Props = {
  onKeyPress: (value: string) => void
  onDelete: () => void
  onUnlock: () => void
}

interface IButton {
  label: string
  variant: 'default' | 'error' | 'success'
}

const buttons: Array<IButton> = [
  { label: '1', variant: 'default' },
  { label: '2', variant: 'default' },
  { label: '3', variant: 'default' },
  { label: '4', variant: 'default' },
  { label: '5', variant: 'default' },
  { label: '6', variant: 'default' },
  { label: '7', variant: 'default' },
  { label: '8', variant: 'default' },
  { label: '9', variant: 'default' },
]

export const KeyPad: React.FC<Props> = ({ onDelete, onKeyPress, onUnlock }) => {
  return (
    <View style={{ ...grid.row, ...styles.root }}>
      {buttons.map(button => (
        <View
          key={button.label}
          style={{
            ...grid.column4,
            ...styles.keyWrapper,
          }}>
          <DialButton
            label={button.label}
            testID={button.label}
            variant={button.variant}
            onPress={() => onKeyPress(button.label)}
          />
        </View>
      ))}
      <View
        style={{
          ...grid.column4,
          ...styles.keyWrapper,
        }}>
        <DialButton
          label="DEL"
          testID="DEL"
          variant="error"
          onPress={() => onDelete()}
        />
      </View>
      <View
        style={{
          ...grid.column4,
          ...styles.keyWrapper,
        }}>
        <DialButton
          label="0"
          testID="0"
          variant="default"
          onPress={() => onKeyPress('0')}
        />
      </View>
      <View
        style={{
          ...grid.column4,
          ...styles.keyWrapper,
        }}>
        <DialButton
          label="OK"
          testID="OK"
          variant="success"
          onPress={() => onUnlock()}
        />
      </View>
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
  },
})
