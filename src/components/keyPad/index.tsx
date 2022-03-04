import React from 'react'
import { StyleSheet, View } from 'react-native'

import { DialButton } from '../button/DialButton'
import { grid } from '../../styles/grid'

type Props = {
  onKeyPress: (value: string) => void
  onDelete: () => void
  onUnlock: () => void
}

export const KeyPad: React.FC<Props> = ({ onDelete, onKeyPress, onUnlock }) => {
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
            testID={`${index + 1}`}
            onPress={() => onKeyPress(`${index + 1}`)}
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
          onPress={onDelete}
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
          onPress={onUnlock}
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
