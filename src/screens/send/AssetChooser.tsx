import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from 'src/styles'
import { grid } from 'src/styles'
import { IAssetChooser } from './types'
import { TokenImage } from '../home/TokenImage'
import SlideUpModal from '../../components/slideUpModal/SlideUpModal'
import { balanceToString } from '../balances/BalancesScreen'
import { TokenButton } from 'components/button/TokenButton'
import { getTokenColor } from '../home/tokenColor'

export const AssetChooser = <T,>({
  assetList,
  selectedAsset,
  onAssetSelected,
}: IAssetChooser<T>) => {
  const [showSelector, setShowSelector] = useState<boolean>(false)
  const [animateModal, setAnimateModal] = useState(false)

  const handleAsset = (asset: T) => () => {
    setAnimateModal(true)
    onAssetSelected(asset)
  }
  const handleCloseModal = () => {
    setShowSelector(false)
    setAnimateModal(false)
  }

  const handleAnimateModal = () => {
    setAnimateModal(true)
  }

  return (
    <TouchableOpacity
      onPress={() => setShowSelector(true)}
      style={grid.row}
      accessibilityLabel="choose">
      <View style={{ ...grid.column12, ...styles.assetButton }}>
        <View style={styles.assetContainer}>
          <View style={styles.assetIcon}>
            <TokenImage symbol={selectedAsset.symbol} height={19} width={19} />
          </View>
          <Text style={styles.assetTitle}>{selectedAsset.symbol}</Text>
        </View>
        <Text style={styles.selectLabel}>select</Text>
      </View>
      <SlideUpModal
        title={'select asset'}
        showSelector={showSelector}
        animateModal={animateModal}
        onModalClosed={handleCloseModal}
        onAnimateModal={handleAnimateModal}
        backgroundColor={colors.darkPurple3}
        headerFontColor={colors.white}>
        {assetList.map(asset => (
          <View key={asset.symbol}>
            <TokenButton
              onPress={handleAsset(asset)}
              title={asset.symbol}
              balance={balanceToString(
                asset.balance.toString(),
                asset.decimals,
              )}
              icon={<TokenImage symbol={asset.symbol} />}
              style={{ backgroundColor: getTokenColor(asset.symbol) }}
            />
          </View>
        ))}
      </SlideUpModal>
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
    marginLeft: 20,
    marginTop: 20,
    marginRight: 15,
    padding: 5,
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 29,
    width: 29,
  },
  assetTitle: {
    marginTop: 25,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  selectLabel: {
    margin: 25,
    color: colors.white,
  },
})
