import React from 'react'
import { View } from 'react-native'

import { RegularText } from 'src/components'

import { sharedMnemonicStyles } from './styles'

interface WordInterface {
  number: number
  text: string
}

export const WordView: React.FC<WordInterface> = ({ number, text }) => (
  <View style={sharedMnemonicStyles.wordContainer}>
    <View style={sharedMnemonicStyles.wordRow}>
      <View>
        <View style={sharedMnemonicStyles.wordNumberBadge}>
          <RegularText style={sharedMnemonicStyles.wordNumberBadgeText}>
            {number}
          </RegularText>
        </View>
      </View>
      <View>
        <RegularText
          style={sharedMnemonicStyles.wordText}
          accessibilityLabel={`word${number} ${text}`}>
          {text}
        </RegularText>
      </View>
    </View>
  </View>
)
