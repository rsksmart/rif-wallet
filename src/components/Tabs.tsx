import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../styles'

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
            <TouchableOpacity key={tab} onPress={() => onTabSelected(tab)}>
              <Text style={[tabStyle, styles.tabText]}>{tab}</Text>
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
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },
  tabTitleText: {
    color: colors.white,
    padding: 10,
  },
})
