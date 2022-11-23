import { StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { DefaultRIFGateway, IRGListing } from 'src/lib/gateway'
import { useSelectedWallet } from 'src/Context'
import { ethers } from 'ethers'

// interface Props {}

export const GatewayScreen = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [listings, setListings] = useState<IRGListing[]>([])

  useEffect(() => {
    if (wallet) {
      console.log('get rGateway 😲')
      const rGateway = DefaultRIFGateway(
        wallet.provider as ethers.providers.Web3Provider,
      )

      rGateway.getServices().then(data => {
        const IRGServices = console.log('services')
        console.log(IRGServices)
        console.log(data)
      })
    }
  }, [wallet])

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
      </View>
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
})
