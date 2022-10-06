import React from 'react'
import { View, Text } from 'react-native'
import { RIFWallet } from '../../lib/core'
import { NavigationProp } from '../../RootNavigation'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { ScreenWithWallet } from '../types'
import { SendScreen } from './SendScreen'

interface Interface {
  navigation: NavigationProp
}

export const SendScreenContainer: React.FC<ScreenWithWallet & Interface> = ({
  wallet,
  isWalletDeployed,
  navigation,
}) => {
  const handleTransfer = () => {
    console.log('handling transfer...')
    return Promise.reject('transaction cancelled')
  }

  const chainId = 31

  const { state } = useSocketsState()
  /*
  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]
  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<Error>()

  const [chainId, setChainId] = useState<number>(31)

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const transfer = (token: ITokenWithBalance, amount: string, to: string) => {
    setError(undefined)
    setCurrentTransaction({ status: 'USER_CONFIRM' })

    // handle both ERC20 tokens and the native token (gas)
    const transferMethod =
      token.symbol === 'TRBTC'
        ? makeRBTCToken(wallet, chainId)
        : convertToERC20Token(token, {
            signer: wallet,
            chainId,
          })

    transferMethod.decimals().then((decimals: number) => {
      const tokenAmount = BigNumber.from(utils.parseUnits(amount, decimals))

      transferMethod
        .transfer(to.toLowerCase(), tokenAmount)
        .then((txPending: ContractTransaction) => {
          const current: transactionInfo = {
            to,
            value: amount,
            symbol: transferMethod.symbol,
            hash: txPending.hash,
            status: 'PENDING',
          }
          setCurrentTransaction(current)

          txPending
            .wait()
            .then(() =>
              setCurrentTransaction({ ...current, status: 'SUCCESS' }),
            )
            .catch(() =>
              setCurrentTransaction({ ...current, status: 'FAILED' }),
            )
        })
        .catch((err: any) => {
          setError(err)
          setCurrentTransaction(null)
        })
    })
  }

  
  */

  const onDeployWalletNavigate = () =>
    navigation.navigate('ManuallyDeployScreen' as any)

  return (
    <SendScreen
      navigateToDeploySceen={onDeployWalletNavigate}
      isWalletDeployed={isWalletDeployed}
      handleTransfer={handleTransfer}
      balances={state.balances}
      prices={state.prices}
      transactions={state.transactions}
      chainId={chainId}
    />
  )
}
