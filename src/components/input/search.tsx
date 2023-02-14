import { StyleSheet } from 'react-native'
import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'
import { Input, InputProps } from './index'

export const Search = (props: InputProps) => {
  return (
    <Input
      containerStyle={styles.search}
      leftIcon={{
        name: 'search',
        size: 16,
        color: sharedColors.inputLabelColor,
      }}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  search: castStyle.view({
    paddingLeft: 20,
  }),
})
