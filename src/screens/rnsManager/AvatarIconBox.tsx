import { StyleSheet, View } from 'react-native'
import { ComponentProps } from 'react'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { Typography } from 'src/components'
import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'

interface AvatarIconBoxProps {
  text: string
  containerViewProps?: ComponentProps<typeof View>
  avatarIconProps?: ComponentProps<typeof AvatarIcon>
  typographyProps?: ComponentProps<typeof Typography>
}
export const AvatarIconBox = ({
  text,
  containerViewProps,
  avatarIconProps,
  typographyProps,
}: AvatarIconBoxProps) => (
  <View style={styles.avatarBoxViewStyle} {...containerViewProps}>
    <AvatarIcon value={text} size={80} {...avatarIconProps} />
    <Typography
      type="h3"
      style={styles.domainTypographyTextStyle}
      {...typographyProps}>
      {text}
    </Typography>
  </View>
)

const styles = StyleSheet.create({
  avatarBoxViewStyle: castStyle.view({
    backgroundColor: sharedColors.background.secondary,
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 20,
  }),
  domainTypographyTextStyle: castStyle.text({
    marginTop: 12,
  }),
})
