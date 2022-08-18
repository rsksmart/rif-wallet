import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { NavigationProp } from '../../RootNavigation'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'

interface ContactFormScreenProps {
  navigation: NavigationProp
}

export const ContactFormScreen: React.FC<ContactFormScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Icon.Button
          name="arrow-back"
          onPress={() => navigation.navigate('ContactsList' as never)}
          backgroundColor={colors.background.primary}
          color={colors.lightPurple}
          style={styles.backButton}
          size={15}
          borderRadius={20}
        />
        <Text style={styles.title}>Create Contact</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    paddingRight: 0,
    alignSelf: 'center',
    color: colors.lightPurple,
  },
  title: {
    flex: 2,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    alignSelf: 'center',
  },
  none: {
    flex: 1,
  },
})
