import { Text } from 'react-native'
import { CheckIcon } from '../icons/CheckIcon'
import DeleteIcon from '../icons/DeleteIcon'
import React from 'react'

type Props = {
  status: string
}

export const STATUS_MAP = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
}

const StatusIcon = ({ status }: Props) => {
  switch (status.toUpperCase()) {
    case STATUS_MAP.SUCCESS:
      return <CheckIcon color="green" width={30} height={30} />
    case STATUS_MAP.FAILED:
      return <DeleteIcon color="red" width={30} height={30} />
    case STATUS_MAP.PENDING:
      return <Text>Pending</Text>
    default:
      throw new Error(`Tried to use a non-existent status: ${status} `)
  }
}

export default StatusIcon
