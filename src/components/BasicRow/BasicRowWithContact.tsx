import { useSelector } from 'react-redux'

import { BasicRow, BasicRowProps } from 'components/BasicRow/index'
import { getContactByAddress } from 'store/slices/contactsSlice'

export interface BasicRowWithContact extends BasicRowProps {
  addressToSearch: string
}

export const BasicRowWithContact = ({
  addressToSearch,
  ...props
}: BasicRowWithContact) => {
  const contact = useSelector(getContactByAddress(addressToSearch))

  return (
    <BasicRow
      {...props}
      avatarName={contact?.name || 'A'}
      label={contact?.name || props.label}
    />
  )
}
