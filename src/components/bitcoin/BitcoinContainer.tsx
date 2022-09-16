import { useBitcoinCoreContext } from '../../Context'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SemiBoldText } from '../typography'
import { colors } from '../../styles'
import { NETWORK_DATA, NETWORK_ID } from './constants'
import BitcoinNetwork from './BitcoinNetwork'
import BIP from './BIP'
import ActiveButton from '../button/ActiveButton'
import BitcoinNetworkStore from '../../storage/BitcoinNetworkStore'
import CopyField from '../activity/CopyField'
const allowedBitcoinNetworks = Object.keys(NETWORK_ID).filter(
  id => !NETWORK_DATA[id].disabled,
)

const CreateNetworkContainer: React.FC<{ networkId: string }> = ({
  networkId,
}) => {
  const { refreshStoredNetworks } = useBitcoinCoreContext()

  const handleCreate = () => {
    BitcoinNetworkStore.addNewNetwork(networkId, ['BIP84']).then(() =>
      refreshStoredNetworks(),
    )
  }
  return (
    <ActiveButton
      text={'Create network ' + networkId}
      onPress={handleCreate}
      style={styles.createNetworkButton}
    />
  )
}
const BitcoinContainer = () => {
  const btc = useBitcoinCoreContext()
  const networksThatCanBeCreated: Array<string> = allowedBitcoinNetworks.filter(
    id => !btc.networks.find(i => i.networkId === id),
  )
  return (
    <ScrollView style={styles.container} testID="BitcoinContainer.ScrollView">
      {networksThatCanBeCreated.map(id => (
        <CreateNetworkContainer key={id} networkId={id} />
      ))}
      <SemiBoldText style={styles.networkText}>Networks</SemiBoldText>
      {btc.networks.map(network => (
        <BitcoinNetworkPresentation key={network.networkId} network={network} />
      ))}
    </ScrollView>
  )
}

const BitcoinNetworkPresentation: React.FC<{ network: BitcoinNetwork }> = ({
  network,
}) => {
  return (
    <View style={styles.bitcoinNetworkView}>
      <SemiBoldText>Network {network.networkName}</SemiBoldText>
      <SemiBoldText>Satoshis: {network.balance}</SemiBoldText>
      {network.bips.map(bip => (
        <BitcoinNetworkBIPPresentation key={bip.bipId} bip={bip} />
      ))}
    </View>
  )
}

const BitcoinNetworkBIPPresentation: React.FC<{ bip: BIP }> = ({ bip }) => {
  const first10addresses = useMemo(() => {
    let addresses = []
    for (let addressIndex = 0; addressIndex < 10; addressIndex++) {
      addresses.push(bip.getAddress(addressIndex))
    }
    return addresses
  }, [bip])
  return (
    <View style={styles.bipView}>
      <SemiBoldText>BIP: {bip.bipId}</SemiBoldText>
      <CopyField
        text={'Public Key: ' + bip.accountPublicKey}
        textToCopy={bip.accountPublicKey}
      />
      {first10addresses.map(address => (
        <View key={address} style={styles.addressView}>
          <CopyField text={address as string} textToCopy={address} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.light,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: '5%',
    paddingBottom: 200,
  },
  addressText: {
    fontSize: 12,
  },
  createNetworkButton: {
    width: 'auto',
  },
  addressView: {
    margin: 10,
  },
  networkText: {
    marginTop: 20,
  },
  bipView: {
    margin: 10,
  },
  bitcoinNetworkView: { marginBottom: 50 },
})
export default React.memo(BitcoinContainer)
