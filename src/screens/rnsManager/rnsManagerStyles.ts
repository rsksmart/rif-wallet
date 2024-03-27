import { StyleSheet } from 'react-native'

import { castStyle } from 'shared/utils/index'
import { sharedColors } from 'shared/constants'
import { colors } from 'src/styles'

export const rnsManagerStyles = StyleSheet.create({
  scrollContainer: castStyle.view({
    backgroundColor: sharedColors.background.primary,
  }),
  container: castStyle.view({
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 50,
  }),
  profileHeader: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: sharedColors.black,
  }),
  profileImageContainer: castStyle.view({
    alignItems: 'center',
    backgroundColor: sharedColors.background.secondary,
    borderRadius: 10,
    paddingVertical: 20,
  }),
  profileImage: castStyle.view({
    width: 80,
    height: 80,
    borderRadius: 100,
  }),
  profileDisplayAlias: castStyle.view({
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 0,
  }),
  marginTop: castStyle.view({
    marginTop: 10,
  }),
  marginBottom: castStyle.view({
    marginBottom: 10,
  }),
  bottomContainer: castStyle.view({
    flex: 1,
    justifyContent: 'flex-end',
  }),
  button: castStyle.view({
    marginTop: 20,
    height: 50,
  }),
  disabledButton: castStyle.view({
    opacity: 0.4,
  }),
})
