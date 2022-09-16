import React, { useState } from 'react'
import BitcoinNetwork from '../../components/bitcoin/BitcoinNetwork'
import BIP from '../../components/bitcoin/BIP'
import { useBitcoinCoreContext } from '../../Context'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { MediumText } from '../../components'
import SlideUpSelect from '../../components/SlideUpSelect'
import ActiveButton from '../../components/button/ActiveButton'

const BitcoinReceiveScreen: React.FC<any> = ({
  route: {
    params: { network },
  },
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<BitcoinNetwork | null>(
    network,
  )
  const [selectedBip, setSelectedBip] = useState<BIP | null>(null)
  const [showNetworkSelect, setShowNetworkSelect] = useState<boolean>(false)
  const [showBipSelect, setShowBipSelect] = useState<boolean>(false)
  const [address, setAddress] = useState<string | null>(null)
  const { networksMap } = useBitcoinCoreContext()

  const networks = React.useMemo(() => {
    return Object.keys(networksMap).map(networkId => ({ networkId: networkId }))
  }, [networksMap])
  const bips = React.useMemo(() => {
    return selectedNetwork ? selectedNetwork.bips : []
  }, [selectedNetwork])

  const onNetworkSelect = React.useCallback(
    networkId => () => {
      setSelectedNetwork(networksMap[networkId])
    },
    [],
  )

  const onBipSelect = React.useCallback(
    bipItem => () => {
      setSelectedBip(bipItem)
    },
    [],
  )

  const onNetworkSelectChange = React.useCallback(
    (value: boolean) => () => setShowNetworkSelect(value),
    [],
  )
  const onBipSelectChange = React.useCallback(
    (value: boolean) => () => setShowBipSelect(value),
    [],
  )

  const onGenerateNewAddressTouch = () => {
    if (!selectedBip) {
      return
    }
    const newAddress = selectedBip.getAddress(5)
    setAddress(newAddress)
  }
  console.log(address)
  return (
    <View>
      <ActiveButton
        text="Select network"
        onPress={onNetworkSelectChange(true)}
      />
      <MediumText>Selected: {selectedNetwork?.networkName}</MediumText>
      <SlideUpSelect
        title="Select coin"
        itemsArray={networks}
        renderKey="networkId"
        RenderComponent={({ networkId }) => (
          <TouchableOpacity onPress={onNetworkSelect(networkId)}>
            <MediumText style={styles.text}>{networkId}</MediumText>
          </TouchableOpacity>
        )}
        shouldShow={showNetworkSelect}
        onClose={onNetworkSelectChange(false)}
      />
      <ActiveButton
        text="Select address type"
        onPress={onBipSelectChange(true)}
      />
      <SlideUpSelect
        title="Select address type"
        itemsArray={bips}
        renderKey="bipId"
        RenderComponent={({ bipName, item }) => (
          <TouchableOpacity onPress={onBipSelect(item)}>
            <MediumText style={styles.text}>{bipName}</MediumText>
          </TouchableOpacity>
        )}
        shouldShow={showBipSelect}
        onClose={onBipSelectChange(false)}
      />
      <MediumText>
        Selected Address Generator: {selectedBip?.bipName}
      </MediumText>
      <ActiveButton
        text="Generate new address"
        onPress={onGenerateNewAddressTouch}
        style={styles.activeButton}
      />
      <MediumText>Address: {address}</MediumText>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  activeButton: {
    width: 'auto',
  },
})

export default BitcoinReceiveScreen
