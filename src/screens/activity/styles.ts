import { StyleSheet } from 'react-native'

export const activityDetailsStyles = StyleSheet.create({
  container: {
    backgroundColor: '#dbe3ff',
    paddingTop: 21,
  },
  backButtonContainer: {
    backgroundColor: '#c6ccea',
    alignSelf: 'flex-start',
    borderRadius: 40,
    marginBottom: 19,
    marginLeft: 15,
  },
  transDetails: {
    marginBottom: 20,
    paddingHorizontal: 35,
  },
  flexHalfSize: {
    flexGrow: 1,
  },
  statusField: {
    marginRight: 10,
  },
  timestampField: {
    marginLeft: 10,
  },
  mb200: {
    marginBottom: 200,
  },
  mb50: {
    marginBottom: 50,
  },
  textMrMl: {
    marginRight: 4,
    marginLeft: 2,
  },
  flexDirRow: {
    flexDirection: 'row',
  },
  flexNoWrap: {
    flexWrap: 'nowrap',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  amountContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  fwb: { fontWeight: 'bold' },
  statusRow: {
    flex: 40,
    marginRight: 10,
  },
  timestampRow: {
    flex: 60,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  assetIcon: {
    alignSelf: 'center',
    paddingRight: 6,
  },
})
