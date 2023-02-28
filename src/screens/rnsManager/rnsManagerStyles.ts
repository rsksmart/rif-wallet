import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
export const rnsManagerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
    paddingHorizontal: 20,
  },
  title: {
    color: '#FBFBFB',
    fontSize: 18,
  },
  subtitle: {
    color: '#FBFBFB',
    fontSize: 22,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingLeft: 10,
    backgroundColor: colors.background.black,
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
  marginTop: {
    marginTop: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
})
