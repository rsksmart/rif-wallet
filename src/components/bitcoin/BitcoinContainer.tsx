import { useBitcoinCoreContext } from '../../Context'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { MediumText, SemiBoldText } from '../typography'
import { colors } from '../../styles'
import { NETWORK_DATA, NETWORK_ID } from './constants'
import BitcoinNetwork from './BitcoinNetwork'
import BIP from './BIP'
import ActiveButton from '../button/ActiveButton'
import BitcoinNetworkStore from '../../storage/BitcoinNetworkStore'
const allowedBitcoinNetworks = Object.keys(NETWORK_ID).filter(
  id => !NETWORK_DATA[id].disabled,
)

const CreateNetworkContainer: React.FC<{ networkId: string }> = ({
  networkId,
}) => {
  const { refreshStoredNetworks } = useBitcoinCoreContext()

  const handleCreate = () => {
    console.log('creating...')
    BitcoinNetworkStore.addNewNetwork(networkId, ['BIP84']).then(() =>
      refreshStoredNetworks(),
    )
  }
  return (
    <ActiveButton text={'Create network ' + networkId} onPress={handleCreate} />
  )
}
const BitcoinContainer = () => {
  const btc = useBitcoinCoreContext()
  const networksThatCanBeCreated: Array<string> = allowedBitcoinNetworks.filter(
    id => !btc.networks.find(i => i.networkId === id),
  )

  return (
    <ScrollView style={styles.container}>
      {networksThatCanBeCreated.map(id => (
        <CreateNetworkContainer key={id} networkId={id} />
      ))}
      <SemiBoldText>Networks</SemiBoldText>
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
    <View>
      <SemiBoldText>Network {network.networkName}</SemiBoldText>
      <SemiBoldText>Satoshis: {network.balance}</SemiBoldText>
      <SemiBoldText>Balance: {network.balance / Math.pow(10, 8)}</SemiBoldText>
      {network.bips.map(bip => (
        <BitcoinNetworkBIPPresentation key={bip.bipId} bip={bip} />
      ))}
    </View>
  )
}

const BitcoinNetworkBIPPresentation: React.FC<{ bip: BIP }> = ({ bip }) => {
  const first20addresses = useMemo(() => {
    let addresses = []
    for (let addressIndex = 0; addressIndex < 3; addressIndex++) {
      addresses.push(bip.getAddress(addressIndex))
    }
    return addresses
  }, [bip])
  return (
    <View>
      <SemiBoldText>BIP: {bip.bipId}</SemiBoldText>
      <SemiBoldText>Public Key: {bip.accountPublicKey}</SemiBoldText>
      {first20addresses.map(address => (
        <MediumText key={address}>{address}</MediumText>
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
  },
  addressText: {
    fontSize: 12,
  },
})
export default React.memo(BitcoinContainer)
