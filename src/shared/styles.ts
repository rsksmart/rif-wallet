import { StyleSheet } from 'react-native'

import { castStyle } from 'shared/utils'

export const sharedStyles = StyleSheet.create({
  coverAllScreen: {
    height: '100%',
    backgroundColor: '#F5FCFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: '#E5E8E8',
    borderRadius: 40,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalViewMainSection: {
    padding: 35,
    margin: 0,
    backgroundColor: '#fff',
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowInColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '50%',
  },
  textInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#919191',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  inputText: {
    padding: 15,
    marginTop: 0,
    marginBottom: 10,

    borderRadius: 10,
    backgroundColor: 'rgba(49, 60, 60, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,

    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.24,
    color: '#373f48',
  },
  marginBottom: castStyle.view({
    marginBottom: 10,
  }),
  marginTop20: castStyle.view({
    marginTop: 20,
  }),
})
