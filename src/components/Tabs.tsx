import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../styles'

interface Props {
  title: string
  tabs: string[]
  selectedTab: string
  onTabSelected: (tab: string) => void
}

export const Tabs = ({ title, tabs, selectedTab, onTabSelected }: Props) => {
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
              key={tab}
              onPress={() => onTabSelected(tab)}
              accessibilityLabel={tab}>
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
