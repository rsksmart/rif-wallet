import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { BigNumber, utils, ContractTransaction } from 'ethers'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'
import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo, { transactionInfo } from './TransactionInfo'
import { colors } from '../../styles/colors'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet }) => {
  const { state } = useSocketsState()

  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<string>()

  const [chainId, setChainId] = useState<number>(31)

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const transfer = (token: ITokenWithBalance, amount: string, to: string) => {
    setError(undefined)
    setCurrentTransaction({ status: 'USER_CONFIRM' })

    // handle both ERC20 tokens and gas
    const transferMethod =
      token.contractAddress === '0x0000000000000000000000000000000000000000'
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
          // create variable because it won't be saved in the compiler otherwise
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

  return (
    <ScrollView style={styles.parent}>
      {!currentTransaction ? (
        <TransactionForm
          onConfirm={transfer}
          tokenList={Object.values(state.balances)}
          tokenPrices={state.prices}
          chainId={chainId}
          initialValues={{
            recipient: route.params?.to,
            amount: '0',
            asset: route.params?.contractAddress
              ? state.balances[route.params.contractAddress]
              : state.balances[contractAddress],
          }}
        />
      ) : (
        <TransactionInfo transaction={currentTransaction} />
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.darkBlue,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  label: {
    color: colors.white,
    marginBottom: 5,
  },

  chooseAsset: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 14,
    paddingLeft: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
  },
  error: {
    marginTop: 10,
    color: colors.orange,
    textAlign: 'center',
  },
})
