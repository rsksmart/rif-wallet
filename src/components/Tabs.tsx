import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors } from '../styles'
import { RegularText } from './typography'

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
        <RegularText style={styles.tabTitleText}>{title}</RegularText>
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
              <RegularText style={[tabStyle, styles.tabText]}>
                {tab}
              </RegularText>
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
    paddingBottom: 0,
  },
  tabTitleText: {
    color: colors.white,
    padding: 10,
  },
})
