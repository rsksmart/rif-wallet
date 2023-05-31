import { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { Typography } from 'components/typography'
import { castStyle } from 'shared/utils'

interface HomeInformationItemProps {
  title: string
  subTitle: string
  icon?: ReactElement
}

export const HomeInformationItem = ({
  title,
  subTitle,
  icon,
}: HomeInformationItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography type={'h4'} style={styles.title}>
          {title}
        </Typography>
        <Typography type={'body3'}>{subTitle}</Typography>
      </View>
      {icon}
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  textContainer: castStyle.view({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  }),
  title: castStyle.text({
    paddingBottom: 10,
    fontSize: 16,
  }),
})
