import React from 'react'

import { View, Text } from 'react-native'
import { sharedMnemonicStyles } from './styles'

interface WordInterface {
  number: number
  text: string
}

export const Word: React.FC<WordInterface> = ({ number, text }) => (
  <View style={sharedMnemonicStyles.wordContainer}>
    <View>
      <View style={sharedMnemonicStyles.wordNumberBadge}>
        <Text style={sharedMnemonicStyles.wordNumberBadgeText}>{number}</Text>
      </View>
    </View>
    <View>
      <Text style={sharedMnemonicStyles.wordText}>{text}</Text>
    </View>
  </View>
)
