import { colors } from '../../styles'
import { StyleSheet } from 'react-native'
export const rnsManagerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
  },

  backButton: {
    color: colors.lightPurple,
    backgroundColor: colors.blue2,
    borderRadius: 20,
    padding: 10,
    bottom: 3,
  },
  profileImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  profileDisplayAlias: {
    color: colors.lightPurple,
    padding: 10,
    paddingBottom: 0,
    alignSelf: 'center',
    fontSize: 18,
  },
  aliasRequestInfo: {
    color: colors.lightPurple,
    alignSelf: 'center',
    padding: 5,
    paddingTop: 10,
  },
  aliasRequestInfo2: {
    color: colors.gray,
    alignSelf: 'center',
    padding: 5,
  },
  marginBottom: {
    marginBottom: 10,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
})
