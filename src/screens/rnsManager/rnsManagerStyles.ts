import { StyleSheet } from 'react-native'

import { sharedColors } from 'shared/constants'
import { colors } from 'src/styles'

export const rnsManagerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.black,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: sharedColors.subTitle,
  },
  subtitle: {
    color: sharedColors.subTitle,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.background.black,
  },
  profileImageContainer: {
    alignItems: 'center',
    backgroundColor: sharedColors.inputInactive,
    borderRadius: 10,
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  profileDisplayAlias: {
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 0,
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
    justifyContent: 'flex-end',
  },
  disabledButton: {
    opacity: 0.4,
  },
})
