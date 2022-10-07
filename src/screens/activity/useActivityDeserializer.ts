import { ActivityRowPresentationType } from './types'
import moment from 'moment'
import { balanceToDisplay } from '../../lib/utils'
import { ActivityMixedType } from './ActivityRow'

const useActivityDeserializer: (
  activityTransaction: ActivityMixedType,
) => ActivityRowPresentationType = activityTransaction => {
  if ('isBitcoin' in activityTransaction) {
    return {
      symbol: activityTransaction.symbol,
      to: activityTransaction.to,
      value: activityTransaction.valueBtc,
      timeHumanFormatted: moment
        .unix(Number(activityTransaction.blockTime))
        .fromNow(),
      status: activityTransaction.status,
      id: activityTransaction.txid,
    }
  } else {
    const status = activityTransaction.originTransaction.receipt
      ? 'success'
      : 'pending'
    const timeFormatted = moment
      .unix(activityTransaction.originTransaction.timestamp)
      .fromNow()
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
