import { toChecksumAddress } from 'components/address/lib'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { balanceToDisplay } from 'lib/utils'
import {
  RootStackNavigationProp,
  rootStackRouteNames,
} from 'navigation/rootNavigator/types'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Paragraph } from 'src/components'
import { useBitcoinCoreContext, useSelectedWallet } from 'src/Context'
import { selectAccounts } from 'src/redux/slices/accountsSlice/selector'
import { colors } from 'src/styles'
import { selectAppState } from 'store/slices/appStateSlice/selectors'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeHooks'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import PortfolioComponent from './PortfolioComponent'
import SelectedTokenComponent from './SelectedTokenComponent'
import SendReceiveButtonComponent from './SendReceiveButtonComponent'
import { getTokenColor } from './tokenColor'

export type HomeScreenProps = {
  navigation: RootStackNavigationProp
  changeTopColor: (color: string) => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  changeTopColor,
}) => {
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const { networksMap } = useBitcoinCoreContext()
  const { selectedWalletIndex, wallet, chainId } = useSelectedWallet()
  const accounts = useAppSelector(selectAccounts)

  const { isSetup } = useAppSelector(selectAppState)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )
  const balances: Array<ITokenWithoutLogo | BitcoinNetwork> =
    React.useMemo(() => {
      return [...Object.values(tokenBalances), ...Object.values(networksMap)]
    }, [tokenBalances, networksMap])
  // token or undefined
  const selected: ITokenWithoutLogo | BitcoinNetwork | undefined =
    selectedAddress
      ? tokenBalances[selectedAddress] || networksMap[selectedAddress]
      : undefined
  const selectedColor = getTokenColor(selected ? selected.symbol : undefined)
  const backGroundColor = {
    backgroundColor: selectedAddress ? selectedColor : getTokenColor('DEFAULT'),
  }

  useEffect(() => {
    if (!selected) {
      balances.length !== 0
        ? setSelectedAddress(balances[0].contractAddress)
        : undefined
    }
  }, [balances])

  // interact with the navigation
  const handleSendReceive = (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
    if (selected instanceof BitcoinNetwork) {
      return handleBitcoinSendReceive(screen)
    }
    switch (screen) {
      case 'SEND':
        return navigation.navigate(rootStackRouteNames.Send, {
          token: selected?.symbol,
          contractAddress: selected?.contractAddress,
        })
      case 'RECEIVE':
        return navigation.navigate(rootStackRouteNames.Receive)
      case 'FAUCET':
        const address = wallet?.smartWallet.smartWalletContract.address
        address && addBalance(toChecksumAddress(address, chainId))
        return
    }
  }

  const handleBitcoinSendReceive = (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
    if (selected instanceof BitcoinNetwork) {
      switch (screen) {
        case 'RECEIVE':
          return navigation.navigate(rootStackRouteNames.ReceiveBitcoin, {
            network: selected,
          })
        case 'SEND':
          return navigation.navigate(rootStackRouteNames.Send, {
            token: selected?.symbol,
            contractAddress: selected?.contractAddress,
          })
      }
    }
  }

  const addBalance = (address: string) => {
    console.log('temporarly removed', address)
  }

  // pass the new color to Core to update header:
  useEffect(() => {
    changeTopColor(selectedColor)
  }, [selectedColor])

  const selectedTokenAmount = React.useMemo(() => {
    if (selected instanceof BitcoinNetwork) {
      return selected.balance
    }
    if (selected) {
      return balanceToDisplay(selected.balance, selected.decimals, 5)
    }
    return '0'
  }, [selected, balances])
  // waiting for the balances to load:
  if (!isSetup) {
    return <LoadingScreen />
  }

  let accountName = 'account 1'
  if (typeof selectedWalletIndex === 'number') {
    accountName =
      accounts[selectedWalletIndex]?.name ||
      `account ${selectedWalletIndex + 1}`
  }
  return (
    <View style={styles.container}>
      <View style={{ ...styles.topColor, ...backGroundColor }} />
      <View style={styles.bottomColor} />

      <View style={styles.parent}>
        <SelectedTokenComponent
          accountName={accountName}
          amount={selectedTokenAmount}
          change={0}
        />

        <SendReceiveButtonComponent
          color={selectedColor}
          onPress={handleSendReceive}
          sendDisabled={balances.length === 0}
        />

        {balances.length === 0 ? (
          <>
            <Image
              source={require('src/images/noBalance.png')}
              style={styles.noBalance}
            />
            <Paragraph style={styles.text}>
              You don't have any balances, get some here!
            </Paragraph>
          </>
        ) : (
          <PortfolioComponent
            selectedAddress={selectedAddress}
            setSelected={setSelectedAddress}
            balances={balances}
            prices={prices}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.darkPurple3,
  },
  topColor: {
    flex: 1,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  bottomColor: {
    flex: 6,
  },

  parent: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
  text: {
    textAlign: 'center',
    color: colors.white,
  },
  noBalance: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
})
