import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../../styles/colors'

type Props = {
  title: string
  tabs: string[]
  selectedTab: string
  onTabSelected: any
}

export const Tabs: React.FC<Props> = ({
  title,
  tabs,
  selectedTab,
  onTabSelected,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabTitleContainer}>
        <Text style={styles.tabTitleText}>{title}</Text>
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map(tab => {
          const tabStyle =
            selectedTab === tab
              ? { ...styles.tab, ...styles.selectedTab }
              : styles.tab
          return (
            <TouchableOpacity
              style={tabStyle}
              onPress={() => onTabSelected(tab)}>
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tabTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tab: {
    borderColor: colors.gray,
    borderBottomWidth: 2,
  },
  selectedTab: {
    borderColor: colors.white,
  },
  tabText: {
    color: colors.white,
    padding: 5,
  },
  tabTitleText: {
    color: colors.white,
    padding: 5,
  },
})
