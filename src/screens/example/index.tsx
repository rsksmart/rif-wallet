import { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'

import { AppButton, Avatar } from 'components/index'
import { Input } from 'components/input'
import { sharedColors, sharedStyles } from 'shared/constants'
import { EyeIcon } from 'components/icons/EyeIcon'
import { castStyle } from 'src/shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'
import { useWallet } from 'src/shared/wallet'

export const signTypedDataV4Payload = {
  domain: {
    // Defining the chain aka Rinkeby goerli or Ethereum Main Net
    chainId: 31,
    // Give a user friendly name to the specific contract you are signing for.
    name: 'Ether Mail',
    // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    // Just let's you know the latest version. Definitely make sure the field name is correct.
    version: '1',
  },

  // Defining the message signing data content.
  message: {
    /*
     - Anything you want. Just a JSON Blob that encodes the data you want to send
     - No required fields
     - This is DApp Specific
     - Be as explicit as possible when building out the message schema.
    */
    contents: 'Hello, Bob!',
    attachedMoneyInEth: 4.2,
    from: {
      name: 'Cow',
      wallets: [
        '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
      ],
    },
    to: [
      {
        name: 'Bob',
        wallets: [
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
          '0xB0B0b0b0b0b0B000000000000000000000000000',
        ],
      },
    ],
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'Mail',
  types: {
    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    // Not an EIP712Domain definition
    Group: [
      { name: 'name', type: 'string' },
      { name: 'members', type: 'Person[]' },
    ],
    // Refer to PrimaryType
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person[]' },
      { name: 'contents', type: 'string' },
    ],
    // Not an EIP712Domain definition
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallets', type: 'address[]' },
    ],
  },
}

export const ExampleScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.ExampleScreen>) => {
  const wallet = useWallet()
  const methods = useForm({
    defaultValues: {
      ex1: '',
      ex2: '',
      ex3: '',
      ex4: '',
      ex5: '',
      ex6: '',
      ex7: '',
    },
  })
  const { resetField } = methods
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
      headerStyle: {
        backgroundColor: sharedColors.black,
      },
    })
  }, [navigation])

  const onSignTypedData = async () => {
    const result = await wallet._signTypedData(
      signTypedDataV4Payload.domain,
      signTypedDataV4Payload.types,
      signTypedDataV4Payload.message,
    )

    console.log('onSignTypedData result', result)
  }

  const onSignMessage = async () => {
    const result = await wallet.signMessage('SIGN THIS PLEASE')

    console.log('onSignMessage result', result)
  }

  return (
    <View style={sharedStyles.screen}>
      <FormProvider {...methods}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps={'handled'}>
          <AppButton
            title={'Trigger SignTypedData'}
            onPress={onSignTypedData}
          />
          <AppButton
            style={{ marginTop: 12 }}
            title={'Trigger SignMessage'}
            onPress={onSignMessage}
          />
          <Input
            inputName={'ex1'}
            placeholder={'Example 1'}
            label={'Example 1'}
            resetValue={() => resetField('ex1')}
          />
          <Input
            inputName={'ex2'}
            placeholder={'Example 2'}
            label={'Example 2'}
            rightIcon={{ name: 'copy', size: 20, color: sharedColors.white }}
          />
          <Input
            inputName={'ex3'}
            placeholder={'Example 3'}
            label={'Example 3'}
            rightIcon={<EyeIcon isHidden={false} />}
          />
          <Input
            inputName={'ex4'}
            placeholder={'Example 4'}
            label={'Example 4'}
            leftIcon={<EyeIcon isHidden={true} />}
            resetValue={() => resetField('ex4')}
            subtitle={'dshduhsbdjsnjn'}
          />
          <Input
            inputName={'ex5'}
            placeholder={'Example 5'}
            label={'Example 5'}
            leftIcon={<Avatar name={'Andrea'} size={32} />}
            resetValue={() => resetField('ex5')}
            rightIcon={{ name: 'copy', size: 16 }}
            subtitle={'dshduhsbdjsnjn'}
          />
          <Input
            inputName={'ex6'}
            placeholder={'Example 6'}
            label={'Example 6'}
            leftIcon={<Avatar name={'Denis'} size={32} />}
            rightIcon={<EyeIcon isHidden={true} />}
            resetValue={() => resetField('ex6')}
            subtitle={'dshduhsbdjsnjn'}
          />
          <Input
            inputName={'ex7'}
            placeholder={'Example 7'}
            label={'Example 7'}
            leftIcon={<Avatar name={'Blabla'} size={32} />}
            resetValue={() => resetField('ex7')}
            subtitle={'dshduhsbdjsnjn'}
            isReadOnly
          />
        </ScrollView>
      </FormProvider>
    </View>
  )
}

export const styles = StyleSheet.create({
  scrollContent: castStyle.view({ paddingBottom: 100 }),
})
