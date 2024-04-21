import { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'

import { Avatar } from 'components/index'
import { Input } from 'components/input'
import { sharedColors, sharedStyles } from 'shared/constants'
import { EyeIcon } from 'components/icons/EyeIcon'
import { castStyle } from 'src/shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'

export const ExampleScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.ExampleScreen>) => {
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
        backgroundColor: sharedColors.background.primary,
      },
    })
  }, [navigation])

  return (
    <View style={sharedStyles.screen}>
      <FormProvider {...methods}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps={'handled'}>
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
            rightIcon={{
              name: 'copy',
              size: 20,
              color: sharedColors.text.primary,
            }}
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
