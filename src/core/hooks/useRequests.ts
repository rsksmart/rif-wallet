import { useState } from 'react'
import { OnRequest } from '@rsksmart/rif-wallet-core'

import { Requests } from '../../Context'

export const useRequests = () => {
  const [requests, setRequests] = useState<Requests>([])

  const onRequest: OnRequest = request => setRequests([request])
  const closeRequest = () => setRequests([] as Requests)

  return { requests, onRequest, closeRequest }
}
