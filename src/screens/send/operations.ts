import { BigNumber, utils, ContractTransaction, ethers } from 'ethers'
import { RIFWallet } from '../../lib/core'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'

const sendBtcTransaction = (): Promise<string> => {
  // @francis, create the transaction and send it
  return Promise.reject('Not implemented yet...')
}

const sendRbtcTransaction = (
  wallet: RIFWallet,
  chainId: number,
  to: string,
  amount: string,
): Promise<string> => {
  const rBtcTx = makeRBTCToken(wallet, chainId)
  const tokenAmount = BigNumber.from(utils.parseUnits(amount, 18))
  return rBtcTx
    .transfer(to.toLowerCase(), tokenAmount)
    .then((tx: ContractTransaction) => tx.hash)
}

const sendERC20Transaction = async (
  wallet: RIFWallet,
  chainId: number,
  token: ITokenWithBalance,
  to: string,
  amount: string,
): Promise<string> => {
  const tokenContract = convertToERC20Token(token, {
    signer: wallet,
    chainId,
  })

  return tokenContract.decimals().then((decimals: number) => {
    const tokenAmount = BigNumber.from(utils.parseUnits(amount, decimals))
    return tokenContract
      .transfer(to.toLowerCase(), tokenAmount)
      .then((tx: ContractTransaction) => tx.hash)
  })
}

export const sendTransaction = (
  wallet: RIFWallet, // or
  chainId: number,
  token: ITokenWithBalance,
  to: string,
  amount: string,
): Promise<string> => {
  switch (token.symbol) {
    case 'RBTC':
      return sendRbtcTransaction(wallet, chainId, to, amount)
    case 'BTC':
      return sendBtcTransaction()
    default:
      return sendERC20Transaction(wallet, chainId, token, to, amount)
  }
}

export const pollTransaction = (rifWallet: RIFWallet, hash: string) =>
  new Promise<boolean>((resolve, reject) => {
    const checkInterval = setInterval(() => {
      rifWallet.provider
        ?.getTransactionReceipt(hash)
        .then((response: ethers.providers.TransactionReceipt) => {
          if (response) {
            clearInterval(checkInterval)
            resolve(response.status === 1)
          }
        })
        .catch((err: Error) => reject(err))
    }, 2000)
  })
