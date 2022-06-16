import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import CarotDownIcon from '../../components/icons/CarotDown'
import { TokenImage } from '../home/TokenImage'
import TokenSelector from '../../components/tokenSelector'

interface Interface {
  selectedToken: ITokenWithBalance
  tokenList: ITokenWithBalance[]
  handleTokenSelection: (token: ITokenWithBalance) => void
}

const AssetChooser: React.FC<Interface> = ({
  selectedToken,
  tokenList,
  handleTokenSelection,
}) => {
  const [showSelector, setShowSelector] = useState<boolean>(false)
  const [animateModal, setAnimateModal] = useState(false)

  const handleToken = (token: ITokenWithBalance) => {
    setAnimateModal(true)
    //setShowSelector(false)
    handleTokenSelection(token)
  }
  const handleCloseModal = () => {
    setShowSelector(false)
    setAnimateModal(false)
    //setShowSelector(true)
  }

  const handleAnimateModal = () => {
    setAnimateModal(true)
  }

  return (
    <TouchableOpacity
      onPress={() => setShowSelector(true)}
      style={{ ...styles.container, ...grid.row }}>
      <View style={{ ...grid.column10, ...styles.tokenSymbol }}>
        <Text style={styles.symbolText}>{selectedToken.symbol}</Text>
        <View style={styles.imageContainer}>
          <TokenImage symbol={selectedToken.symbol} height={25} width={25} />
        </View>
      </View>
      <View style={{ ...grid.column2, ...styles.dropdown }}>
        <CarotDownIcon />
      </View>

      <TokenSelector
        showSelector={showSelector}
        animateModal={animateModal}
        availableTokens={tokenList}
        onTokenSelection={handleToken}
        onModalClosed={handleCloseModal}
        onAnimateModal={handleAnimateModal}
      />
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
    right: 10,
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
