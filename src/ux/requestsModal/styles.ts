import { StyleSheet } from 'react-native'

import { castStyle } from 'shared/utils'

export const requestStyles = StyleSheet.create({
  typographyHeaderStyle: castStyle.text({
    marginBottom: 40,
  }),
  typographyRowStyle: castStyle.text({
    marginBottom: 20,
  }),
})
