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
  const contact = useSelector(
    getContactByAddress(addressToSearch.toLowerCase()),
  )

  return (
    <BasicRow
      {...props}
      avatar={{
        name: contact?.name,
        imageSource: contact ? undefined : require('src/images/user.png'),
      }}
      label={contact?.name || props.label}
    />
  )
}
