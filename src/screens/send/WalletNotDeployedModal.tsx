import React from 'react'
import { StyleSheet, View } from 'react-native'
import WarningIcon from '../../components/icons/WarningIcon'
import { RegularText, SemiBoldText } from '../../components'

type WalletNotDeployedViewType = {}
const WalletNotDeployedView: React.FC<WalletNotDeployedViewType> = () => (
  <View style={styles.container} testID="WalletNotDeployedView">
    <WarningIcon size={200} color="orange" />
    <SemiBoldText style={styles.oopsText}>
      Oooops! Wallet is not deployed!
    </SemiBoldText>
    <RegularText style={styles.regularText}>
      Please go to the Settings (Gear Icon at the top right) then tap on Smart
      Wallet Deploy then tap on Deploy to start sending funds
    </RegularText>
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 11,
    backgroundColor: 'rgba(0,0,0,0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  oopsText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  regularText: {
    color: 'white',
    paddingHorizontal: 20,
  },
})

export default WalletNotDeployedView
