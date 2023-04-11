import Clipboard from '@react-native-community/clipboard'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  AppTouchable,
  Input,
  Typography,
  getAddressDisplayText,
} from 'components/index'
import { PublicKeyItemType } from 'screens/accounts/types'
import { defaultIconSize, sharedColors } from 'shared/constants'
import { sharedStyles } from 'shared/styles'
import { castStyle } from 'shared/utils'
import { setAccount } from 'store/slices/accountsSlice'
import { selectAccounts } from 'store/slices/accountsSlice/selector'
import { AccountPayload } from 'store/slices/accountsSlice/types'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'

import { CheckIcon } from '../icons/CheckIcon'

interface AccountBoxProps {
  address: string
  smartWalletAddress: string
  id?: number
  publicKeys: PublicKeyItemType[]
}

export const AccountBox = ({
  address,
  smartWalletAddress,
  publicKeys = [],
  id = 0,
}: AccountBoxProps) => {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAccounts)
  const { isDeployed } = useAppSelector(selectActiveWallet)
  const initialAccountName = accounts[id]?.name || `account ${id + 1}`
  const [accountName, setAccountName] = useState<string>(initialAccountName)
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

  const methods = useForm()

  const { t } = useTranslation()

  return (
    <FormProvider {...methods}>
      <View style={styles.accountTextContainer}>
        {!showAccountNameInput ? (
          <View style={styles.accountLabel}>
            <Typography type={'h3'} style={styles.accountText}>
              {accountName}
            </Typography>
            <AppTouchable width={110} onPress={onEdit}>
              <Typography type={'h4'} style={styles.accountEditButton}>
                {t('settings_screen_edit_name_label')}
              </Typography>
            </AppTouchable>
          </View>
        ) : (
          <>
            <TextInput
              autoFocus={true}
              style={styles.accountInput}
              value={accountName}
              onChangeText={onChangeAccountName}
              onSubmitEditing={onSubmit}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={onSubmit}>
              <CheckIcon
                color={sharedColors.labelLight}
                width={35}
                height={35}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.statusContainer}>
        <Typography type={'h4'}>{t('settings_screen_status_label')}</Typography>
        <View style={styles.status}>
          <Typography type={'h4'} style={styles.statusText}>
            {isDeployed
              ? t('settings_screen_deployed_label')
              : t('settings_screen_not_deployed_label')}
          </Typography>
          {isDeployed ? (
            <Icon
              name={'check-circle'}
              size={24 || defaultIconSize}
              color={sharedColors.successLight}
            />
          ) : (
            <Icon
              name={'exclamation-circle'}
              size={24 || defaultIconSize}
              color={sharedColors.dangerLight}
            />
          )}
        </View>
      </View>
      <Input
        style={sharedStyles.marginTop20}
        label={t('settings_screen_eoa_account_label')}
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
        testID={'TestID.eoaAddress'}
      />
      <Input
        style={sharedStyles.marginTop20}
        label={t('settings_screen_smart_wallet_address_label')}
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
        testID={'TestID.smartWalletAddress'}
      />

      {publicKeys.map(publicKey => (
        <Input
          key={publicKey.publicKey}
          style={sharedStyles.marginTop20}
          label={t(
            publicKey.networkName + ' ' + t('settings_screen_public_key_label'),
          )}
          inputName={
            publicKey.networkName + ' ' + t('settings_screen_public_key_label')
          }
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
          testID={'TestID.publicKey'}
        />
      ))}
    </FormProvider>
  )
}

const styles = StyleSheet.create({
  statusContainer: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: sharedColors.inputInactive,
    paddingLeft: 16,
    paddingRight: 24,
    marginTop: 12,
    borderRadius: 10,
    minHeight: 80,
  }),
  status: castStyle.view({ flexDirection: 'row' }),
  statusText: castStyle.view({ marginRight: 5, marginTop: 3 }),
  accountTextContainer: castStyle.view({
    marginTop: 30,
    alignItems: 'center',
    flexDirection: 'row',
  }),
  accountLabel: castStyle.view({
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  }),
  accountText: castStyle.view({
    maxWidth: 240,
  }),
  accountEditButton: castStyle.text({
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
  }),

  accountInput: castStyle.text({
    color: sharedColors.labelLight,
    fontSize: 22,
    borderWidth: 1,
    borderColor: sharedColors.labelLight,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 0,
  }),
})
