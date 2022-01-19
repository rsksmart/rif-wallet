import React from 'react'

import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { CompassIcon, CopyIcon } from '../../components/icons'
import { SquareButton } from '../../components/button/SquareButton'

import { grid } from '../../styles/grid'

import { getAddressDisplayText } from '../../components'
import { getTokenColor } from '../home/tokenColor'

type Props = {
  hash: string
  info?: string
  selectedToken: string
  handleCopy: () => void
  handleOpen: () => void
}
const TransactionInfo = ({
  hash,
  info,
  selectedToken,
  handleCopy,
  handleOpen,
}: Props) => {
  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6
  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 20)) / 2,
    width: qrCodeSize + 40,
  }

  return (
    <React.Fragment>
      {info && <Text>{info}</Text>}
      <View style={{ ...styles.hashContainer, ...qrContainerStyle }}>
        <Text style={styles.hash}>
          {getAddressDisplayText(hash).displayAddress}
        </Text>
      </View>
      <Text style={styles.hashLabel}>transaction hash</Text>

      <View style={grid.row}>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <SquareButton
            onPress={handleCopy}
            title="copy"
            testID="Hash.CopyButton"
            icon={
              <CopyIcon
                width={55}
                height={55}
                color={getTokenColor(selectedToken)}
              />
            }
          />
        </View>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <SquareButton
            onPress={handleOpen}
            title="open"
            testID="Hash.OpenURLButton"
            icon={
              <CompassIcon
                width={30}
                height={30}
                color={getTokenColor(selectedToken)}
              />
            }
          />
        </View>
      </View>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  hash: {
    color: '#5C5D5D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  hashContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .7)',
  },
  hashLabel: {
    color: '#5C5D5D',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  bottomColumn: {
    alignItems: 'center',
  },
})

export default TransactionInfo
