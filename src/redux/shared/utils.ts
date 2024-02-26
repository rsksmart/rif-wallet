// Update transaction based on status
// Pending will add a pendingTransaction
import {
  addPendingTransaction,
  modifyTransaction,
} from '../slices/transactionsSlice'
import { AppDispatch } from '../store'
import {
  ApiTransactionWithExtras,
  ModifyTransaction,
  OnSetTransactionStatusChange,
  TransactionStatus,
} from './types'

// When it's done waiting, it'll modifyTransaction to update it with the receipt
export const handleTransactionStatusChange =
  (dispatch: AppDispatch) =>
  (
    transactionStatusChange: Parameters<OnSetTransactionStatusChange>[0] | null,
  ) => {
    if (transactionStatusChange !== null) {
      switch (transactionStatusChange.txStatus) {
        case TransactionStatus.PENDING:
          const {
            hash,
            data,
            from,
            gasPrice,
            nonce,
            value,
            symbol,
            finalAddress,
            enhancedAmount,
          } = transactionStatusChange

          const originTransaction: ApiTransactionWithExtras = {
            blockHash: '',
            blockNumber: 0,
            gas: 0,
            input: '',
            timestamp: Number(Date.now().toString().substring(0, 10)),
            transactionIndex: 0,
            txId: '',
            txType: 'contract call',
            to: finalAddress as string,
            hash,
            data,
            from,
            gasPrice: gasPrice?.toString() || '',
            nonce,
            value: value.toString(),
            symbol,
            finalAddress,
            enhancedAmount,
          }

          dispatch(addPendingTransaction(originTransaction))
          break
        case TransactionStatus.USER_CONFIRM:
          const {
            blockHash,
            blockNumber,
            gasUsed,
            transactionHash,
            transactionIndex,
          } = transactionStatusChange
          const updatedOriginTransaction: ModifyTransaction = {
            gas: gasUsed.toNumber(),
            hash: transactionHash,
            blockHash,
            blockNumber,
            transactionIndex: transactionIndex,
            receipt: transactionStatusChange,
            status: TransactionStatus.SUCCESS,
          }
          dispatch(modifyTransaction(updatedOriginTransaction))
          break
        case TransactionStatus.FAILED:
          const updatedTransaction = {
            status: TransactionStatus.FAILED,
            hash: transactionStatusChange.hash,
          }
          dispatch(modifyTransaction(updatedTransaction))
          break
      }
    }
  }
