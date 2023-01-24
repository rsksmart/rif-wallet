import Clipboard from '@react-native-community/clipboard'
import React from 'react'
import { Share, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TestID } from '../screens/receive/ReceiveScreen'
import { colors } from '../styles'
import { CopyIcon, ShareIcon } from './icons'
import { RegularText } from './typography'

type Props = {
  text: string
  valueToShare: string
}

export const ShareableText: React.FC<Props> = ({ text, valueToShare }) => {
  const handleShare = () =>
    Share.share({
      title: valueToShare,
      message: valueToShare,
    })
  const handleCopy = () => Clipboard.setString(valueToShare)
  return (
    <View style={{ ...styles.addressContainer }}>
      <View>
        <RegularText testID={TestID.AddressText} style={styles.smartAddress}>
          {text}
        </RegularText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleShare}
          testID={TestID.ShareButton}
          accessibilityLabel="share">
          <ShareIcon
            style={styles.icon}
            width={30}
            height={30}
            color={'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCopy}
          testID={TestID.CopyButton}
          accessibilityLabel="copy">
          <CopyIcon
            style={styles.icon}
            width={30}
            height={30}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  addressContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.darkPurple2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    marginBottom: 10,
  },
  smartAddress: {
    padding: 13,
    flexWrap: 'wrap',
    fontWeight: '500',
    flexDirection: 'row',
    color: 'white',
  },
  actions: {
    padding: 8,
    flexWrap: 'wrap',
    fontWeight: '500',
    textAlign: 'center',
    flexDirection: 'row',
  },
  icon: {
    flexDirection: 'row',
  },
})
