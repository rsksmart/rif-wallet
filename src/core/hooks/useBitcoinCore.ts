import { useMemo, useEffect, useContext } from 'react'
import BIP39 from '../../lib/bitcoin/BIP39'
import useBitcoinNetworks from '../../components/bitcoin/useBitcoinNetworks'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import bitcoinNetworkStore from '../../storage/BitcoinNetworkStore'
import { OnRequest } from '../../lib/core'
import { BitcoinNetworkWithBIPRequest } from '../../lib/bitcoin/types'
import { createAndInitializeBipWithRequest } from '../../lib/bitcoin/utils'
import { useAuth } from './useAuth'
import { AppContext, useSelectedWallet } from '../../Context'
import { authAxios, publicAxios } from '../setup'
import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
export type useBitcoinCoreResultType = {
  networks: Array<BitcoinNetwork>
  networksMap: {
    [key: string]: BitcoinNetwork
  }
  refreshStoredNetworks: () => void
}
/**
 * Hook that will return networks as an array, networks as a map (networksMap) and a function to refresh networks from the storage
 * This hook will also instantiate the bitcoin networks with a BIPWithRequest class that will handle the payments for the onRequest method
 * that is required in the wallet
 * @param mnemonic
 * @param request
 */
const useBitcoinCore = (
  mnemonic: string,
  request: OnRequest,
): useBitcoinCoreResultType => {
  const [networks, refreshStoredNetworks] = useBitcoinNetworks()
  const { wallet } = useSelectedWallet()
  const { fetcher } = useContext(AppContext)
  const memoizedNetworks = useMemo(() => {
    if (!mnemonic) {
      return { networksArr: [], networksObj: {} }
    }
    const BIP39Instance = new BIP39(mnemonic)
    const networksObj: any = {}
    // let networksArr: BitcoinNetworkWithBIPRequest[] = []
    // login().then(({accessToken, refreshToken}) => {
      // const fetcher = new RifWalletServicesFetcher(authAxios, accessToken, refreshToken)
      const networksArr = Object.values(networks).map(network => {
        const bitcoinNetwork: BitcoinNetworkWithBIPRequest = new BitcoinNetwork(
          network.name,
          network.bips,
          BIP39Instance,
          createAndInitializeBipWithRequest(request),
          {} as any
        ) as BitcoinNetworkWithBIPRequest
        networksObj[network.name] = bitcoinNetwork
        return bitcoinNetwork
      })
      // networksArr = ntwkArr
    // })
    return { networksArr, networksObj}
    
  }, [mnemonic, networks])

  useEffect(() => {
    if (memoizedNetworks.networksArr.length < 1) {
      bitcoinNetworkStore
        .addNewNetwork('BITCOIN_TESTNET', ['BIP84'])
        .then(refreshStoredNetworks)
    }
  }, [memoizedNetworks])
  return {
    networks: memoizedNetworks.networksArr,
    networksMap: memoizedNetworks!.networksObj,
    refreshStoredNetworks,
  }
}

export default useBitcoinCore
