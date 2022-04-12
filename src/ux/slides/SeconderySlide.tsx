import React from 'react'

import { grid } from '../../styles/grid'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { colors } from '../../styles/colors'
const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height
const ITEM_WIDTH = Math.round(WINDOW_WIDTH * 0.7)
const ITEM_HEIGHT = Math.round(WINDOW_HEIGHT * 0.5)
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
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
})
