import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Share } from 'react-native'
import { CopyIcon, ShareIcon } from '../../components/icons'
import { TestID } from './ReceiveScreen'
import { colors } from '../../styles/colors'
import Clipboard from '@react-native-community/clipboard'

type Props = {
  children: string
  valueToShare: string
}

export const ShareableText: React.FC<Props> = ({ children, valueToShare }) => {
  const text = children
  const handleShare = () =>
    Share.share({
      title: valueToShare,
      message: valueToShare,
    })
  const handleCopy = () => Clipboard.setString(valueToShare)
  return (
    <View style={{ ...styles.addressContainer }}>
      <View>
        <Text testID={TestID.AddressText} style={styles.smartAddress}>
          {text}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleShare} testID={TestID.ShareButton}>
          <ShareIcon
            style={styles.icon}
            width={30}
            height={30}
            color={'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCopy} testID={TestID.CopyButton}>
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
