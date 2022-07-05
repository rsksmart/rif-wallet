import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
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
    handleTokenSelection(token)
  }
  const handleCloseModal = () => {
    setShowSelector(false)
    setAnimateModal(false)
  }

  const handleAnimateModal = () => {
    setAnimateModal(true)
  }

  return (
    <TouchableOpacity onPress={() => setShowSelector(true)} style={grid.row}>
      <View style={{ ...grid.column12, ...styles.assetButton }}>
        <View style={styles.assetContainer}>
          <View style={styles.assetIcon}>
            <TokenImage symbol={selectedToken.symbol} height={19} width={19} />
          </View>
          <Text style={styles.assetTitle}>{selectedToken.symbol}</Text>
        </View>
        <Text style={styles.selectLabel}>select</Text>
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
  assetButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.darkPurple5,
    borderRadius: 15,
  },
  assetContainer: {
    flexDirection: 'row',
  },
  assetIcon: {
    margin: 18,
    padding: 5,
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 29,
    width: 29,
  },
  assetTitle: {
    marginTop: 25,
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  selectLabel: {
    margin: 25,
    color: colors.white,
  },
})

export default AssetChooser
