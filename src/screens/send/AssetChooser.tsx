import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import CarotDownIcon from '../../components/icons/CarotDown'
import MiniModal from '../../components/tokenSelector/MiniModal'
import { TokenImage } from '../home/TokenImage'

interface Interface {
  selectedToken: ITokenWithBalance
  tokenList: ITokenWithBalance[]
  handleTokenSelection: any
}

const AssetChooser: React.FC<Interface> = ({
  selectedToken,
  tokenList,
  handleTokenSelection,
}) => {
  const [showSelector, setShowSelector] = useState<boolean>(false)
  console.log({ tokenList, handleTokenSelection })

  const handleToken = (token: any) => {
    setShowSelector(false)
    handleTokenSelection(token)
  }

  return (
    <TouchableOpacity
      onPress={() => setShowSelector(true)}
      style={{ ...styles.container, ...grid.row }}>
      <View style={{ ...grid.column9, ...styles.tokenSymbol }}>
        <Text style={styles.symbolText}>{selectedToken.symbol}</Text>
        <View style={styles.imageContainer}>
          <TokenImage symbol={selectedToken.symbol} height={25} width={25} />
        </View>
      </View>
      <View style={{ ...grid.column3, ...styles.dropdown }}>
        <CarotDownIcon />
      </View>

      {showSelector && (
        <MiniModal onTokenSelection={handleToken} availableTokens={tokenList} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
  tokenSymbol: {
    backgroundColor: colors.darkPurple2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
    position: 'relative',
  },
  symbolText: {
    position: 'absolute',
    top: 13,
    left: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    display: 'flex',
    position: 'absolute',
    right: 5,
    top: 10,
  },
  dropdown: {
    backgroundColor: colors.darkPurple,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    paddingLeft: 10,
  },
})

export default AssetChooser
