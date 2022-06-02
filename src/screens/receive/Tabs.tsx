import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../../styles/colors'

type Props = {
  tabs: string[]
  selectedTab: string
  onTabSelected: any
}

export const Tabs: React.FC<Props> = ({ tabs, selectedTab, onTabSelected }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => {
        const tabStyle =
          selectedTab === tab
            ? { ...styles.tab, ...styles.selectedTab }
            : styles.tab
        return (
          <TouchableOpacity style={tabStyle} onPress={() => onTabSelected(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  tab: {
    borderColor: colors.gray,
    borderBottomWidth: 2,
    padding: 5,
  },
  selectedTab: {
    borderColor: colors.white,
  },
  tabText: {
    color: colors.white,
  },
})
