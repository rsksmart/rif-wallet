import { StyleSheet, View } from 'react-native'
import { ComponentProps } from 'react'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { Typography } from 'src/components'
import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'

interface AvatarIconBoxProps {
  text: string
  ContainerViewProps?: ComponentProps<typeof View>
  AvatarIconProps?: ComponentProps<typeof AvatarIcon>
  TypographyProps?: ComponentProps<typeof Typography>
}
export const AvatarIconBox = ({
  text,
  ContainerViewProps,
  AvatarIconProps,
  TypographyProps,
}: AvatarIconBoxProps) => (
  <View style={styles.avatarBoxViewStyle} {...ContainerViewProps}>
    <AvatarIcon value={text} size={80} {...AvatarIconProps} />
    <Typography
      type="h3"
      style={styles.domainTypographyTextStyle}
      {...TypographyProps}>
      {text}
    </Typography>
  </View>
)

const styles = StyleSheet.create({
  avatarBoxViewStyle: castStyle.view({
    backgroundColor: sharedColors.inputInactive,
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 20,
  }),
  domainTypographyTextStyle: castStyle.text({
    marginTop: 12,
  }),
})
