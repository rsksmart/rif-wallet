import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { AppTouchable, Avatar, Typography } from 'components/index'
import { castStyle } from 'shared/utils'
import { noop, sharedColors } from 'shared/constants'

enum TestID {
  ContactCard = 'ContactCard',
  ContactCardTypography = 'ContactCardTypography',
}

interface Props {
  name: string
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export const ContactCard = ({ name, style, onPress }: Props) => {
  return (
    <AppTouchable
      width={100}
      style={[styles.contactCard, style]}
      onPress={onPress || noop}
      accessibilityLabel={TestID.ContactCard}>
      <>
        <Avatar size={46} name={name} />
        <Typography
          style={styles.contactName}
          type="h4"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          accessibilityLabel={TestID.ContactCardTypography}>
          {name}
        </Typography>
      </>
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  contactCard: castStyle.view({
    backgroundColor: sharedColors.background.secondary,
    paddingVertical: 13.5,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    height: 100,
  }),
  contactName: castStyle.text({
    alignItems: 'center',
    textAlign: 'center',
  }),
})
