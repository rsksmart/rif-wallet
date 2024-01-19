import { sharedColors } from 'shared/constants'

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILED = 'failed',
}

export const transactionStatusToIconPropsMap = new Map([
  [
    TransactionStatus.SUCCESS,
    {
      iconName: 'check-circle',
      iconColor: sharedColors.successLight,
      displayText: 'confirmed',
    },
  ],
  [undefined, null],
])

export const transactionStatusDisplayText = new Map([
  [TransactionStatus.SUCCESS, 'transaction_confirmed_status'],
  [TransactionStatus.PENDING, 'transaction_pending_status'],
  [TransactionStatus.FAILED, 'transaction_failed_status'],
  [undefined, ''],
])
