import { CheckIcon } from '../icons/CheckIcon'
import DeleteIcon from '../icons/DeleteIcon'
import ScheduleIcon from '../icons/ScheduleIcon'

type Props = {
  status: string
  [key: string]: any
}

export const STATUS_MAP = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
}

const StatusIcon = ({ status, ...props }: Props) => {
  switch (status.toUpperCase()) {
    case STATUS_MAP.SUCCESS:
      return <CheckIcon color="green" width={30} height={30} {...props} />
    case STATUS_MAP.FAILED:
      return <DeleteIcon color="red" width={30} height={30} {...props} />
    case STATUS_MAP.PENDING:
      return <ScheduleIcon color="white" size={30} {...props} />
    default:
      throw new Error(`Tried to use a non-existent status: ${status} `)
  }
}

export default StatusIcon
