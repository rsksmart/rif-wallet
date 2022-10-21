import { ActivityRowPresentationObjectType, ActivityMixedType } from './types'
import {
  balanceToDisplay,
  convertUnixTimeToFromNowFormat,
} from '../../lib/utils'

const useActivityDeserializer: (
  activityTransaction: ActivityMixedType,
) => ActivityRowPresentationObjectType = activityTransaction => {
  if ('isBitcoin' in activityTransaction) {
    return {
      symbol: activityTransaction.symbol,
      to: activityTransaction.to,
      value: activityTransaction.valueBtc,
      timeHumanFormatted: convertUnixTimeToFromNowFormat(
        activityTransaction.blockTime,
      ),
      status: activityTransaction.status,
      id: activityTransaction.txid,
    }
  } else {
    const status = activityTransaction.originTransaction.receipt
      ? 'success'
      : 'pending'
    const timeFormatted = convertUnixTimeToFromNowFormat(
      activityTransaction.originTransaction.timestamp,
    )
    const valueConverted = () => {
      if (activityTransaction.enhancedTransaction?.value) {
        return activityTransaction.enhancedTransaction.value
      }
      return balanceToDisplay(activityTransaction.originTransaction.value, 18)
    }
    return {
      symbol:
        (activityTransaction?.enhancedTransaction?.symbol as string) ||
        ('' as string),
      to: activityTransaction.originTransaction.to,
      timeHumanFormatted: timeFormatted,
      status,
      value: valueConverted(),
      id: activityTransaction.originTransaction.hash,
    }
  }
}

export default useActivityDeserializer
