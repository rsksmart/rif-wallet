import { TransactionRequest } from '@ethersproject/abstract-provider'

export const filterTxOptions = (transactionRequest: TransactionRequest) => Object.keys(transactionRequest)
  .filter(key => !['from', 'to', 'data'].includes(key))
  .reduce((obj: any, key: any) => {
    obj[key] = (transactionRequest as any)[key]
    return obj
  }, {})
