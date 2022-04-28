import React from 'react'

import { grid } from '../../styles/grid'
import { StyleSheet, View, Text, Image } from 'react-native'
import { colors } from '../../styles/colors'
import { WINDOW_HEIGHT, SLIDER_WIDTH } from './Dimensions'

const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.5)
export const SecondarySlide = ({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: Image
}) => (
  <View style={styles.itemContainer}>
    {image}
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
)
const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  description: {
    color: colors.white,
    fontSize: 19,
  },
  center: {
    alignSelf: 'center',
  },
  row: {
    marginVertical: 10,
  },
  itemContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
})
