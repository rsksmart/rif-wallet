import { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { Typography } from 'components/typography'
import { castStyle } from 'shared/utils'
import { defaultIconSize, sharedColors } from 'shared/constants'

interface HomeInformationItemProps {
  title: string
  subTitle: string
  icon?: IconProps | ReactElement
}

export const HomeInformationItem = ({
  title,
  subTitle,
  icon,
}: HomeInformationItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography type={'h3'} style={styles.title}>
          {title}
        </Typography>
        <Typography type={'body3'}>{subTitle}</Typography>
      </View>
      <View style={styles.icon}>
        {icon && 'name' in icon ? (
          <Icon
            name={icon.name}
            size={icon.size ? icon.size : defaultIconSize}
            color={icon.color ? icon.color : sharedColors.white}
          />
        ) : (
          icon
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  textContainer: castStyle.text({
    paddingHorizontal: 10,
  }),
  title: castStyle.text({
    paddingBottom: 10,
  }),
  icon: castStyle.text({
    paddingRight: 10,
  }),
})
