import { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { Typography } from 'src/components'
import { castStyle } from 'shared/utils'

type HomeInformationItemProps = {
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
      <View style={styles.ph10}>
        <Typography type={'h3'} style={styles.pb10}>
          {title}
        </Typography>
        <Typography type={'body3'}>{subTitle}</Typography>
      </View>
      <View style={styles.pr10}>{icon ? icon : null}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  ph10: castStyle.text({
    paddingHorizontal: 10,
  }),
  pb10: castStyle.text({
    paddingBottom: 10,
  }),
  pr10: castStyle.text({
    paddingRight: 10,
  }),
})
