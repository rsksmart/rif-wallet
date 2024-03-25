import { BasicRow, BasicRowProps } from 'components/BasicRow/index'
import { Contact } from 'shared/types'
import { sharedColors } from 'shared/constants'

import UserIcon from '../icons/UserIcon'

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
      icon: contact ? undefined : (
        <UserIcon
          backgroundColor={sharedColors.background.secondary}
          color={sharedColors.text.label}
        />
      ),
    }}
  />
)
