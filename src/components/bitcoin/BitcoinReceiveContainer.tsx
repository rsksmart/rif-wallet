import React, { useState } from 'react'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import BIP from '../../lib/bitcoin/BIP'
import { useBitcoinCoreContext } from '../../Context'
import BitcoinReceivePresentation, {
  BitcoinReceivePresentationType,
} from './BitcoinReceivePresentation'

type BitcoinReceiveContainerType = {
  BitcoinReceivePresentationComp?: React.FC<BitcoinReceivePresentationType>
  defaultNetwork?: BitcoinNetwork
}
const BitcoinReceiveContainer: React.FC<BitcoinReceiveContainerType> = ({
  BitcoinReceivePresentationComp = BitcoinReceivePresentation,
  defaultNetwork = undefined,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<
    BitcoinNetwork | undefined
  >(defaultNetwork)
  const [selectedBip, setSelectedBip] = useState<BIP | undefined>(
    selectedNetwork?.bips?.[0] || undefined, // The first BIP is the default one...
  )
  const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false)
  const [showBipModal, setShowBipModal] = useState<boolean>(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false)
  const { networksMap } = useBitcoinCoreContext()

  const networks = React.useMemo(() => {
    return Object.keys(networksMap).map(networkId => ({ networkId: networkId }))
  }, [networksMap])
  const bips = React.useMemo(() => {
    return selectedNetwork ? selectedNetwork.bips : []
  }, [selectedNetwork])

  const onNetworkSelect = React.useCallback(
    networkItem => () => {
      setSelectedNetwork(networksMap[networkItem.networkId])
      setShowNetworkModal(false)
    },
    [],
  )

  const onBipSelect = React.useCallback(
    bipItem => () => {
      setSelectedBip(bipItem)
      setShowBipModal(false)
    },
    [],
  )

  const onShouldShowNetworkModal = React.useCallback(
    (value: boolean) => () => setShowNetworkModal(value),
    [],
  )
  const onShouldShowBipModal = React.useCallback(
    (value: boolean) => () => setShowBipModal(value),
    [],
  )

  const onGenerateNewAddressTouch = () => {
    if (!selectedBip || isFetchingAddress) {
      return
    }
    setIsFetchingAddress(true)
    selectedBip
      .fetchExternalAvailableAddress()
      .then(addressNew => {
        setIsFetchingAddress(false)
        setAddress(addressNew)
      })
      .catch(() => {
        setIsFetchingAddress(false)
      })
  }

  return (
    <BitcoinReceivePresentationComp
      networks={networks}
      selectedNetwork={selectedNetwork}
      bips={bips}
      selectedBip={selectedBip}
      onSelectNewNetwork={onShouldShowNetworkModal(true)}
      shouldShowNetworkModal={showNetworkModal}
      onNetworkSelect={onNetworkSelect}
      onNetworkModalClose={onShouldShowNetworkModal(false)}
      onShouldShowBipModal={onShouldShowBipModal(true)}
      onBipModalClose={onShouldShowBipModal(false)}
      onBipSelect={onBipSelect}
      shouldBipModalShow={showBipModal}
      onGenerateNewAddress={onGenerateNewAddressTouch}
      address={address}
      isFetchingAddress={isFetchingAddress}
    />
  )
}

export default BitcoinReceiveContainer
