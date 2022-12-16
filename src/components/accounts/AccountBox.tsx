import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { SmartWalletFactory } from 'lib/core/SmartWalletFactory'

import { setAccount } from 'store/slices/accountsSlice/accountsSlice'
import { selectAccounts } from 'store/slices/accountsSlice/selector'
import { AccountPayload } from 'store/slices/accountsSlice/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { PublicKeyItemType } from 'screens/accounts/types'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { EditMaterialIcon } from '../icons'
import { CheckIcon } from '../icons/CheckIcon'
import { MediumText } from '../typography'
import AccountField from './AccountField'
import accountSharedStyles from './styles'

interface AccountBoxProps {
  address: string
  addressShort: string
  smartWalletAddress: string
  smartWalletAddressShort: string
  smartWalletFactory: SmartWalletFactory
  id?: number
  publicKeys: PublicKeyItemType[]
}

const AccountBox: React.FC<AccountBoxProps> = ({
  address,
  addressShort,
  smartWalletAddress,
  smartWalletAddressShort,
  smartWalletFactory,
  publicKeys = [],
  id = 0,
}) => {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAccounts)
  const initialAccountName = accounts[id]?.name || `account ${id + 1}`
  const [accountName, setAccountName] = useState<string>(initialAccountName)
  const [isDeployed, setIsDeployed] = useState(false)
  const [showAccountNameInput, setShowAccountInput] = useState<boolean>(false)

  const onEdit = () => setShowAccountInput(true)

  const onChangeAccountName = (text: string) => {
    if (text.length <= 30) {
      setAccountName(text)
    }
  }

  const onSubmit = () => {
    if (accountName) {
      const name = accountName.trim()
      setAccountName(name)
      setShowAccountInput(false)
      const accountPayload: AccountPayload = {
        index: id,
        account: { name },
      }
      dispatch(setAccount(accountPayload))
    }
  }

  useEffect(() => {
    smartWalletFactory.isDeployed().then(setIsDeployed)
  }, [smartWalletFactory])

  useEffect(() => {
    if (accountName !== initialAccountName) {
      setAccountName(initialAccountName)
    }
  }, [initialAccountName, accountName])

  return (
    <View style={styles.accountsContainer}>
      <View style={styles.textContainer}>
        {!showAccountNameInput ? (
          <>
            <MediumText style={styles.text}>{accountName}</MediumText>
            <TouchableOpacity onPress={onEdit}>
              <EditMaterialIcon style={styles.editIcon} size={18} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              autoFocus={true}
              style={styles.accountInput}
              value={accountName}
              onChangeText={onChangeAccountName}
              onSubmitEditing={onSubmit}
            />
            <TouchableOpacity onPress={onSubmit}>
              <CheckIcon color={colors.darkPurple2} width={35} height={35} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={accountSharedStyles.infoSection}>
        <MediumText style={styles.titleFontSize}>Status</MediumText>
        <MediumText style={styles.titleFontSize}>
          {isDeployed ? 'Deployed' : 'Not Deployed'}
        </MediumText>
      </View>
      <AccountField
        label="EOA Address"
        value={addressShort}
        valueToCopy={address}
      />
      <AccountField
        label="Smart Wallet Address"
        value={smartWalletAddressShort}
        valueToCopy={smartWalletAddress}
      />
      {publicKeys.map(publicKey => (
        <AccountField
          label={publicKey.networkName + ' Public Key'}
          value={publicKey.shortedPublicKey}
          valueToCopy={publicKey.publicKey}
          key={publicKey.publicKey}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  accountsContainer: {
    backgroundColor: colors.background.light,
    paddingHorizontal: 24,
    paddingVertical: 38,
    borderRadius: 30,
  },
  textContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
  },
  editIcon: {
    marginLeft: 10,
    color: colors.darkPurple2,
    paddingBottom: 5,
  },
  accountInput: {
    color: colors.darkGray,
    fontFamily: fonts.medium,
    borderWidth: 1,
    borderColor: colors.darkPurple,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  titleFontSize: {
    fontSize: 13,
  },
})

export default AccountBox
