import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import {
  DefaultRIFGateway,
  IRGListing,
  IRGListingAction,
} from 'src/lib/gateway'
import { useSelectedWallet } from 'src/Context'
import { ethers } from 'ethers'
import { RGListingRow } from './RGListingRow'
import { InputModal } from 'src/components/modal/InputModal'
import { RGLendingService } from 'src/lib/gateway/RGServices'

export const GatewayScreen = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [amount, setAmount] = useState<number>()
  const [listings, setListings] = useState<IRGListing[]>([])
  const [subscriptions, setSubscriptions] = useState<IRGListing[]>([])
  // eslint-disable-next-line no-spaced-func
  const [selectedListing, setSelectedListing] = useState<
    (IRGListing & { index: number }) | null
  >(null)
  // eslint-disable-next-line no-spaced-func
  const [selectedSubscription, setSelectedSubscription] = useState<
    (IRGListing & { index: number }) | null
  >(null)
  const [selectedAction, setSelectedAction] =
    useState<IRGListingAction | null>()
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    if (wallet) {
      fetchListings()
    }
  }, [wallet])

  const fetchListings = () => {
    const rGateway = DefaultRIFGateway(
      wallet.provider as ethers.providers.Web3Provider,
    )

    rGateway.getAllListings().then(setListings)
    rGateway
      .getServiceSubscriptions(wallet.smartWallet.signer)
      .then(setSubscriptions)
  }

  const onPressHandler = (
    setterFn: Function,
    listing: IRGListing,
    index: number,
  ) => {
    console.log(setterFn, listing, index)
    setterFn((state: { index: number }) =>
      state?.index === index ? null : { ...listing, index },
    )
  }

  const onActionHandle = (
    action: IRGListingAction,
    showsModal: boolean = true,
  ) => {
    setShowModal(showsModal)
    setSelectedAction(action)

    if (!showsModal) {
      onOkHandler()
    }
  }

  const onDismissModal = () => {
    setShowModal(false)
  }

  const onOkHandler = () => {
    if (selectedAction === IRGListingAction.LEND) {
      const service = new RGLendingService(
        selectedListing!.service,
        wallet.smartWallet.signer,
        wallet.provider as ethers.providers.Web3Provider,
      )

      const lendAmount = amount || 0

      service
        .lend(
          ethers.utils.parseEther(lendAmount.toString()),
          selectedListing!.id,
          wallet._signTypedData,
          chainId?.toString() || '31',
        )
        .then((tx: { wait: Function }) => tx.wait())
        .then(fetchListings)

      setShowModal(false)
    } else if (selectedAction === IRGListingAction.WITHDRAW) {
      const service = new RGLendingService(
        selectedListing!.service,
        wallet.smartWallet.signer,
        wallet.provider as ethers.providers.Web3Provider,
      )

      service
        .withdraw(wallet._signTypedData, chainId?.toString() || '31')
        .then((tx: { wait: Function }) => tx.wait())
        .then(fetchListings)
    }
  }

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
      </View>
      <ScrollView style={styles.servicesList}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>History</Text>
        </View>
        {subscriptions.map((listing, index) => (
          <RGListingRow
            key={listing.service + listing.id.toString()}
            index={index}
            listing={listing}
            selected={index === selectedSubscription?.index}
            onPress={onPressHandler.bind(null, setSelectedSubscription)}
            onAction={onActionHandle}
            consumed={true}
          />
        ))}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Available</Text>
        </View>
        {listings.map((listing, index) => (
          <RGListingRow
            key={listing.service + listing.id.toString()}
            index={index}
            listing={listing}
            selected={index === selectedListing?.index}
            onPress={onPressHandler.bind(null, setSelectedListing)}
            onAction={onActionHandle}
          />
        ))}
      </ScrollView>
      {showModal && (
        <InputModal
          title="Enter amount"
          cancelText="Cancel"
          placeholder={`0.000 ${selectedListing?.currencySymbol}`}
          onCancel={onDismissModal}
          onOk={onOkHandler}
          onTextChange={(value: string) => {
            setAmount(parseFloat(value))
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text.secondary,
  },
  servicesList: {
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
})
