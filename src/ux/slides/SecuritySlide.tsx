import React from 'react'

import { grid } from '../../styles/grid'
import { StyleSheet, View, Text, Image } from 'react-native'
import { colors } from '../../styles/colors'
import { SLIDER_WIDTH, SLIDER_HEIGHT } from './Dimensions'
export const SecuritySlide = ({
  title,
  description,
  description2,
  image,
}: {
  title: string
  description: string
  description2: string
  image: Image
}) => (
  <View style={styles.slideContainer}>
    <View style={styles.imageContainer}>{image}</View>
    <View style={{ ...grid.row, ...styles.rowContainer }}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={{ ...grid.row, ...styles.rowContainer }}>
      <Text style={styles.description}>{description}</Text>
    </View>
    <View style={{ ...grid.row, ...styles.rowContainer }}>
      <Text style={styles.description2}>{description2}</Text>
    </View>
  </View>
)
const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 15,
  },
  description2: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  slideContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rowContainer: {},
})
