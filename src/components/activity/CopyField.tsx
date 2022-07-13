import React from 'react'
import Clipboard from '@react-native-community/clipboard'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CopyIcon } from '../icons'

type ICopyField = {
  text: string
  textToCopy?: string | undefined
  TextComp?: any
  iconSize?: number
  iconViewBox?: string
}

const CopyField: React.FC<ICopyField> = ({
  text,
  textToCopy = undefined,
  TextComp = Text,
  iconSize = 25,
  iconViewBox = undefined,
}) => {
  const onCopy = (): null => {
    Clipboard.setString(textToCopy || text)
    return null
  }
  return (
    <TouchableOpacity onPress={onCopy}>
      <View style={styles.container}>
        <TextComp style={styles.text}>{text}</TextComp>
        <View style={styles.iconView}>
          <CopyIcon
            width={iconSize}
            height={iconSize}
            color="black"
            viewBox={iconViewBox}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    flex: 90,
  },
  iconView: {
    flex: 10,
  },
})

export default CopyField
