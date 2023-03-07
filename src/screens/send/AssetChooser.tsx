import { TokenButton } from 'components/button/TokenButton'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MediumText, RegularText } from 'src/components'
import { colors, grid } from 'src/styles'
import SlideUpModal from '../../components/slideUpModal/SlideUpModal'
import { balanceToString } from '../balances/BalancesScreen'
import { getTokenColor } from '../home/tokenColor'
import { TokenImage } from '../home/TokenImage'
import { IAssetChooser } from './types'

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
          <MediumText style={styles.assetTitle}>
            {selectedAsset.symbol}
          </MediumText>
        </View>
        <RegularText style={styles.selectLabel}>select</RegularText>
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
    marginBottom: 20,
    color: colors.white,
  },
})
