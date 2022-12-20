import Config from 'react-native-config'
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
import {
  RGLendingService,
  RGBorrowingService,
} from 'src/lib/gateway/RGServices'
import { Token } from 'src/lib/gateway/Token'
import { RGSmartWalletFactory } from 'src/lib/gateway/RGSmartWalletFactory'
import { LoadingScreen } from 'src/components/loading/LoadingScreen'

export const GatewayScreen = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [amount, setAmount] = useState<number>()
  const [listings, setListings] = useState<IRGListing[]>([])
  const [subscriptions, setSubscriptions] = useState<IRGListing[]>([])
  // eslint-disable-next-line no-spaced-func
  const [selectedListing, setSelectedListing] = useState<
    (IRGListing & { index: string }) | null
  >(null)
  const [selectedAction, setSelectedAction] =
    useState<IRGListingAction | null>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

  const onPressHandler = (listing: IRGListing, index: string) => {
    console.log('change state to -> ', index)
    setSelectedListing((state: (IRGListing & { index: string }) | null) =>
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
        .then((tx: { wait: Function }) => {
          setLoading(true)
          return tx.wait()
        })
        .then(() => {
          setLoading(false)
          fetchListings()
        })

      setShowModal(false)
    } else if (selectedAction === IRGListingAction.WITHDRAW) {
      const service = new RGLendingService(
        selectedListing!.service,
        wallet.smartWallet.signer,
        wallet.provider as ethers.providers.Web3Provider,
      )

      service
        .withdraw(wallet._signTypedData, chainId?.toString() || '31')
        .then((tx: { wait: Function }) => {
          setLoading(true)
          return tx.wait()
        })
        .then(() => {
          setLoading(false)
          fetchListings()
        })
        .catch(() => {
          setLoading(false)
        })
    } else if (selectedAction === IRGListingAction.BORROW) {
      if (amount === 0) return
      const service = new RGBorrowingService(
        selectedListing!.service,
        wallet.smartWallet.signer,
        wallet.provider as ethers.providers.Web3Provider,
      )

      // TODO: check for user balance on collateral balance

      const borrowAmount = ethers.utils.parseEther(amount!.toString())

      service
        .calculateRequiredCollateral(borrowAmount, selectedListing!.currency)
        .then(amountToLend => {
          // getting aninvalid BigNumber if passing just like that
          console.log('amountToLend', +amountToLend / 1e18)
          return service.borrow(
            borrowAmount,
            selectedListing!.id,
            wallet._signTypedData,
            chainId?.toString() || '31',
            ethers.utils.parseEther((+amountToLend / 1e18).toString()),
          )
        })
        .then((tx: { wait: Function }) => {
          setLoading(true)
          console.log('Borrow tx', tx)
          return tx.wait()
        })
        .then(() => {
          setLoading(false)
          fetchListings()
        })
        .catch(() => {
          setLoading(false)
        })

      setShowModal(false)
    } else if (selectedAction === IRGListingAction.PAY) {
      const service = new RGBorrowingService(
        selectedListing!.service,
        wallet.smartWallet.signer,
        wallet.provider as ethers.providers.Web3Provider,
      )

      const SmartWalletFactoryAddress = Config.GATEWAY_SW_FACTORY || ''
      const smartWallet = new RGSmartWalletFactory(
        SmartWalletFactoryAddress,
        wallet.provider as ethers.providers.Web3Provider,
      )

      const token = new Token(
        selectedListing!.currency,
        wallet.smartWallet.signer,
      )
      console.log('SWFactory address', SmartWalletFactoryAddress)
      setLoading(true)
      let approvedValue = ethers.utils.parseEther('0')

      wallet.smartWallet.signer
        .getAddress()
        .then(signerAddress => {
          console.log('signerAddress', signerAddress)
          return Promise.all([
            smartWallet.getSmartWalletAddress(signerAddress),
            service.getBalance(selectedListing!.currency),
          ])
        })
        .then(([smartWalletAddress, debt]) => {
          console.log('debt', +debt / 1e18)
          console.log('RG smartWalletAddress', smartWalletAddress[0])
          approvedValue = ethers.utils.parseEther(
            (+debt / 1e18 + 0.5).toString(),
          )
          return token.approve(smartWalletAddress[0], approvedValue)
        })
        .then((tx: { wait: Function }) => {
          console.log('Approve tx', tx)
          return tx.wait()
        })
        .then(res => {
          setLoading(false)
          console.log('approve res', res)
          console.log('approved value', +approvedValue / 1e18)
          return service.pay(
            approvedValue,
            selectedListing!.id,
            wallet._signTypedData,
            chainId?.toString() || '31',
          )
        })
        .then((tx: { wait: Function }) => {
          setLoading(true)
          console.log('Pay tx', tx)
          return tx.wait()
        })
        .then(res => {
          setLoading(false)
          console.log('pay res', res)
          fetchListings()
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  return (
    <View style={styles.parent}>
      {loading && !showModal && <LoadingScreen />}
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
            index={'s-' + index}
            listing={listing}
            selected={!!(selectedListing?.index === 's-' + index)}
            onPress={onPressHandler}
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
            index={'l-' + index}
            listing={listing}
            selected={!!(selectedListing?.index === 'l-' + index)}
            onPress={onPressHandler}
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
