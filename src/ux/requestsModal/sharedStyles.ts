import { StyleSheet } from 'react-native'

export const sharedStyles = StyleSheet.create({
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
})
