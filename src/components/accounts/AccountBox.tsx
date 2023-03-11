import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View, Clipboard } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SmartWalletFactory } from '@rsksmart/rif-relay-light-sdk'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome'
import { FormProvider, useForm } from 'react-hook-form'

import { setAccount } from 'store/slices/accountsSlice'
import { selectAccounts } from 'store/slices/accountsSlice/selector'
import { AccountPayload } from 'store/slices/accountsSlice/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { PublicKeyItemType } from 'screens/accounts/types'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { sharedStyles } from 'shared/styles'
import { defaultIconSize, sharedColors } from 'shared/constants'
import { getAddressDisplayText, Input } from 'src/components'
import { selectActiveWallet } from 'store/slices/settingsSlice'

import { EditMaterialIcon } from '../icons'
import { CheckIcon } from '../icons/CheckIcon'
import { MediumText } from '../typography'
import accountSharedStyles from './styles'

interface AccountBoxProps {
  address: string
  smartWalletAddress: string
  smartWalletFactory: SmartWalletFactory
  id?: number
  publicKeys: PublicKeyItemType[]
}

const AccountBox: React.FC<AccountBoxProps> = ({
  address,
  smartWalletAddress,
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
  const { chainType } = useAppSelector(selectActiveWallet)

  const eoaAddressObject = getAddressDisplayText(address ?? '', chainType)
  const smartWalletAddressObject = getAddressDisplayText(
    smartWalletAddress ?? '',
    chainType,
  )
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

  const methods = useForm()

  useEffect(() => {
    if (accountName !== initialAccountName) {
      setAccountName(initialAccountName)
    }
  }, [initialAccountName, accountName])
  const { t } = useTranslation()

  return (
    <FormProvider {...methods}>
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
      <Input
        style={sharedStyles.marginTop20}
        label={t('EOA Address')}
        inputName="EOA Address"
        rightIcon={
          <Icon
            name={'copy'}
            color={sharedColors.white}
            size={defaultIconSize}
            onPress={() =>
              Clipboard.setString(eoaAddressObject.checksumAddress || '')
            }
          />
        }
        placeholder={eoaAddressObject.displayAddress}
        isReadOnly
        testID={'TestID.AddressText'}
      />
      <Input
        style={sharedStyles.marginTop20}
        label={t('Smart Wallet Address')}
        inputName="Smart Wallet Address"
        rightIcon={
          <Icon
            name={'copy'}
            color={sharedColors.white}
            size={defaultIconSize}
            onPress={() =>
              Clipboard.setString(
                smartWalletAddressObject.checksumAddress || '',
              )
            }
          />
        }
        placeholder={smartWalletAddressObject.displayAddress}
        isReadOnly
        testID={'TestID.AddressText'}
      />

      {publicKeys.map(publicKey => (
        <Input
          key={publicKey.publicKey}
          style={sharedStyles.marginTop20}
          label={t(publicKey.networkName + ' Public Key')}
          inputName={publicKey.networkName + ' Public Key'}
          rightIcon={
            <Icon
              name={'copy'}
              color={sharedColors.white}
              size={defaultIconSize}
              onPress={() => Clipboard.setString(publicKey.publicKey || '')}
            />
          }
          placeholder={publicKey.shortedPublicKey}
          isReadOnly
          testID={'TestID.AddressText'}
        />
      ))}


    </FormProvider>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    color: colors.darkGray,
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
    color: colors.darkGray,
  },
})

export default AccountBox
