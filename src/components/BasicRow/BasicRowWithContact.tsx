import { BasicRow, BasicRowProps } from 'components/BasicRow/index'
import { Contact } from 'shared/types'

export interface BasicRowWithContact extends BasicRowProps {
  contact: Contact | undefined
}

export const BasicRowWithContact = ({
  contact,
  ...props
}: BasicRowWithContact) => (
  <BasicRow
    {...props}
    avatar={{
      name: contact?.name,
      imageSource: contact ? undefined : require('src/images/user.png'),
    }}
  />
)
