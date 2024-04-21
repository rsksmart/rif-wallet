import { sharedColors } from 'shared/constants'

import { Input, InputProps } from './index'

export const Search = (props: InputProps) => {
  return (
    <Input
      leftIcon={{
        name: 'search',
        size: 16,
        color: sharedColors.text.label,
      }}
      {...props}
    />
  )
}
