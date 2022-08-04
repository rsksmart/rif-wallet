import { useState } from 'react'
import { Requests } from '../../Context'
import { OnRequest } from '../../lib/core'

export const useRequests = () => {
  const [requests, setRequests] = useState<Requests>([])

  const onRequest: OnRequest = request => setRequests([request])
  const closeRequest = () => setRequests([] as Requests)

  return { requests, onRequest, closeRequest }
}
