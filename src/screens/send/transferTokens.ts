import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'
import { BigNumber, ContractTransaction, utils } from 'ethers'
import { transactionInfo } from './TransactionInfo'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from '../../lib/core'

interface IRifTransfer {
  token: ITokenWithBalance
  amount: string
  to: string
  wallet: RIFWallet
  chainId: number
  onSetError?: (key: any) => void
  onSetCurrentTransaction?: (key: any) => void
}

export const transfer = ({
  to,
  amount,
  wallet,
  chainId,
  token,
  onSetError,
  onSetCurrentTransaction,
}: IRifTransfer) => {
  if (onSetError) {
    onSetError(undefined)
  }
  if (onSetCurrentTransaction) {
    onSetCurrentTransaction({ status: 'USER_CONFIRM' })
  }

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
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction(current)
        }

        txPending
          .wait()
          .then(() => {
            if (onSetCurrentTransaction) {
              onSetCurrentTransaction({ ...current, status: 'SUCCESS' })
            }
          })
          .catch(() => {
            if (onSetCurrentTransaction) {
              onSetCurrentTransaction({ ...current, status: 'FAILED' })
            }
          })
      })
      .catch((err: any) => {
        if (onSetError) {
          onSetError(err)
        }
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction(null)
        }
      })
  })
}
