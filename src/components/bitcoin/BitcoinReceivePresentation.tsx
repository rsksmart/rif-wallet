import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors } from '../../styles'
import BitcoinReceiveField from './BitcoinReceiveField'
import BitcoinSelectModal from './BitcoinSelectModal'
import ActiveButton from '../button/ActiveButton'
import { MediumText } from '../typography'
import ActivityField from '../activity/ActivityField'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import BIP from '../../lib/bitcoin/BIP'
import { CopyIcon } from '../icons'

export type BitcoinReceivePresentationType = {
  selectedNetwork?: BitcoinNetwork
  networks: Array<any>
  bips: Array<any>
  selectedBip: BIP | undefined
  onSelectNewNetwork: () => void
  shouldShowNetworkModal: boolean
  onNetworkSelect: (item: any) => () => void
  onNetworkModalClose: () => void
  onShouldShowBipModal: () => void
  onBipModalClose: () => void
  onBipSelect: (item: any) => () => void
  shouldBipModalShow: boolean
  onGenerateNewAddress: () => void
  address: string | null
  isFetchingAddress: boolean
  onCopyAddressPressed: () => void
}

const BitcoinReceivePresentation: React.FC<BitcoinReceivePresentationType> = ({
  selectedNetwork = undefined,
  networks,
  bips,
  selectedBip,
  onSelectNewNetwork,
  shouldShowNetworkModal,
  onNetworkSelect,
  onNetworkModalClose,
  onShouldShowBipModal,
  onBipModalClose,
  onBipSelect,
  shouldBipModalShow,
  onGenerateNewAddress,
  address,
  isFetchingAddress,
  onCopyAddressPressed,
}) => (
  <View style={styles.container}>
    <BitcoinReceiveField
      label="Network"
      innerText={selectedNetwork?.networkName}
      onFieldPress={onSelectNewNetwork}
    />
    <BitcoinSelectModal
      items={networks}
      title="Select Network"
      renderKey="networkId"
      textKeyValue="networkId"
      onSelect={onNetworkSelect}
      shouldShow={shouldShowNetworkModal}
      onClose={onNetworkModalClose}
    />
    <BitcoinReceiveField
      label="Address Type"
      innerText={selectedBip?.bipName}
      onFieldPress={onShouldShowBipModal}
    />
    <BitcoinSelectModal
      items={bips}
      title="Select Address Type"
      renderKey="bipId"
      textKeyValue="bipName"
      onSelect={onBipSelect}
      shouldShow={shouldBipModalShow}
      onClose={onBipModalClose}
    />

    <ActiveButton
      text="Generate new address"
      onPress={onGenerateNewAddress}
      style={styles.activeButton}
    />
    <View style={styles.viewTop}>
      {isFetchingAddress && (
        <MediumText style={styles.textColor}>Loading new address...</MediumText>
      )}
      {!isFetchingAddress && address && (
        <TouchableOpacity onPress={onCopyAddressPressed}>
          <ActivityField title="Address" LabelStyle={styles.textColor}>
            <View style={styles.addressViewStyle}>
              <MediumText style={styles.addressFontStyle}>{address}</MediumText>
              <CopyIcon width={35} color="black" />
            </View>
          </ActivityField>
        </TouchableOpacity>
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  text: {
    color: 'white',
  },
  activeButton: {
    width: 'auto',
  },
  viewTop: { marginTop: 20 },
  textColor: { color: 'white' },
  addressViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressFontStyle: {
    fontSize: 12,
    flexShrink: 1,
  },
})

export default BitcoinReceivePresentation
