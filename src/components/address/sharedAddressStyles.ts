import { StyleSheet } from 'react-native'
import { colors } from '../../styles'

export const sharedAddressStyles = StyleSheet.create({
  parent: {},
  iconColumn: {
    alignItems: 'flex-end',
  },
  rnsDomainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 15,
  },
  rnsDomainName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
  },
  rnsDomainUnselect: {
    margin: 3,
  },
  rnsDomainAddress: {
    marginLeft: 4,
    fontSize: 11,
  },
  inputContainer: {
    backgroundColor: colors.darkPurple5,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 20,
  },
  input: {
    flex: 5,
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
  },
  invalidAddressText: {
    marginTop: 10,
    color: 'white',
  },
  button: {
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  clearButtonView: {
    backgroundColor: colors.background.secondary,
    borderRadius: 30,
    padding: 2,
  },
  clearButton: {
    color: colors.lightPurple,
  },
  info: {
    marginTop: 5,
    paddingHorizontal: 10,
    color: '#999',
  },
  error: {
    marginTop: 5,
    paddingHorizontal: 10,
    color: colors.orange,
  },
})
