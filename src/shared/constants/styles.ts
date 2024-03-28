import { StyleSheet } from 'react-native'

import { sharedColors } from 'shared/constants'

import { castStyle } from '../utils'

export const sharedStyles = StyleSheet.create({
  displayNone: castStyle.view({
    display: 'none',
  }),
  flex: castStyle.view({
    flex: 1,
  }),
  flexGrow: castStyle.view({
    flexGrow: 1,
  }),
  flexAlignEnd: castStyle.view({
    alignSelf: 'flex-end',
  }),
  row: castStyle.view({
    flexDirection: 'row',
  }),
  textCenter: castStyle.text({
    textAlign: 'center',
  }),
  textLeft: castStyle.text({
    textAlign: 'left',
  }),
  textRight: castStyle.text({
    textAlign: 'right',
  }),
  contentCenter: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
  }),
  alignCenter: castStyle.view({
    alignItems: 'center',
  }),
  marginLeft24: castStyle.view({
    marginLeft: 24,
  }),
  marginBottom: castStyle.view({
    marginBottom: 10,
  }),
  marginTop20: castStyle.view({
    marginTop: 20,
  }),
  marginTop10: castStyle.view({
    marginTop: 10,
  }),
  marginTop40: castStyle.view({
    marginTop: 40,
  }),
  marginRight24: castStyle.view({
    marginRight: 24,
  }),
  paddingHorizontal24: castStyle.view({
    paddingHorizontal: 24,
  }),
  screen: castStyle.view({
    backgroundColor: sharedColors.background.primary,
    paddingHorizontal: 24,
    flex: 1,
  }),
  noPadding: castStyle.view({
    padding: 0,
  }),
  selfCenter: castStyle.view({
    alignSelf: 'center',
  }),
  widthHalfWidth: castStyle.view({
    width: '50%',
  }),
  widthFullWidth: castStyle.view({
    width: '100%',
  }),
  fontBoldText: castStyle.text({
    fontWeight: 'bold',
  }),
  appButtonBottom: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
  coverAllScreen: {
    height: '100%',
    backgroundColor: '#F5FCFF',
  },
  /* GRID */
  column12: {
    display: 'flex',
    width: '100%',
  },
  column10: {
    display: 'flex',
    width: '83.333%',
  },
  column9: {
    display: 'flex',
    width: '75%',
  },
  column8: {
    display: 'flex',
    width: '66.667%',
  },
  column7: {
    display: 'flex',
    width: '56.667%',
  },
  column6: {
    display: 'flex',
    width: '50%',
  },
  column5: {
    display: 'flex',
    width: '41.667%',
  },
  column4: {
    display: 'flex',
    width: '33%',
  },
  column3: {
    display: 'flex',
    width: '25%',
  },
  column2: {
    display: 'flex',
    width: '16.667%',
  },
  column1: {
    display: 'flex',
    width: '8.333%',
  },
  column: {
    display: 'flex',
  },
  offset1: {
    marginLeft: '8.3%',
  },
  offset3: {
    marginLeft: '25%',
  },
})
