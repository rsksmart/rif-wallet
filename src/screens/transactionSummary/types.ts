import { sharedColors } from 'shared/constants'

export enum TransactionStatus {
  NONE = 'NONE',
  USER_CONFIRM = 'USER_CONFIRM',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
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
  [undefined, ''],
])
