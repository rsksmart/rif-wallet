import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, StyleSheet, View, Share } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Clipboard from '@react-native-community/clipboard'

import { noop, sharedColors, sharedStyles } from 'shared/constants'
import {
  AppButton,
  AppTouchable,
  Avatar,
  Input,
  Typography,
} from 'components/index'
import {
  contactsStackRouteNames,
  ContactsStackScreenProps,
} from 'navigation/contactsNavigator'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { useAppDispatch } from 'store/storeUtils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { castStyle } from 'shared/utils'
import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { deleteContactByAddress } from 'store/slices/contactsSlice'

const copyButtonConfig = { name: 'copy', size: 18, color: sharedColors.white }

export const ContactDetails = ({
  navigation,
  route: {
    params: { contact },
  },
}: ContactsStackScreenProps<contactsStackRouteNames.ContactDetails>) => {
  const dispatch = useAppDispatch()
  const [isDeleteContactModalVisible, setIsDeleteContactModalVisible] =
    useState(false)
  const isFocused = useIsFocused()

  const methods = useForm({
    defaultValues: {
      username: contact.name,
      address: contact.address,
    },
  })
  const { getValues } = methods
  const { t } = useTranslation()

  const onHideConfirmDeleteModal = useCallback(() => {
    setIsDeleteContactModalVisible(false)
  }, [])

  const onDeleteContact = useCallback(() => {
    setIsDeleteContactModalVisible(true)
  }, [])

  const onConfirmDeleteContact = useCallback(() => {
    setIsDeleteContactModalVisible(false)
    dispatch(deleteContactByAddress(contact.address))
    navigation.goBack()
  }, [dispatch, contact, navigation])

  const onShareContact = useCallback(() => {
    Share.share({
      title: contact.name,
      message: contact.address,
    })
  }, [contact])

  const onSendToContact = useCallback(() => {
    navigation.navigate(rootTabsRouteNames.Home, {
      screen: homeStackRouteNames.Send,
      params: { to: contact.address },
    })
  }, [navigation, contact])

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.inputInactive))
    }
  }, [dispatch, isFocused])

  useEffect(() => {
    navigation.setOptions({
      headerRight: _ => (
        <AppTouchable
          width={24}
          onPress={onDeleteContact}
          style={sharedStyles.marginRight24}>
          <FontAwesome5Icon
            name={'trash-alt'}
            size={20}
            color={sharedColors.white}
          />
        </AppTouchable>
      ),
    })
  }, [navigation, onDeleteContact])

  const onCopyValue = useCallback(
    (value: string) => () => {
      Alert.alert(t('message_copied_to_clipboard'), undefined, [
        { text: t('ok'), onPress: noop },
      ])
      Clipboard.setString(value)
    },
    [t],
  )

  return (
    <>
      <ConfirmationModal
        isVisible={isDeleteContactModalVisible}
        imgSrc={require('../../images/contact-trash.png')}
        title={`${t('Are you sure you want to delete')} ${contact.name}?`}
        okText={t('Delete')}
        cancelText={t('Cancel')}
        onOk={onConfirmDeleteContact}
        onCancel={onHideConfirmDeleteModal}
      />

      <View style={styles.contactDetailsView}>
        <Avatar name={contact.name} size={52} />
        <View style={styles.nameAddressView}>
          <Typography type={'h2'} color={sharedColors.white}>
            {contact.name}
          </Typography>
          <Typography type={'h4'} color={sharedColors.labelLight}>
            {contact.address}
          </Typography>
        </View>
      </View>
      <BarButtonGroupContainer backgroundColor={sharedColors.secondary}>
        <BarButtonGroupIcon
          onPress={onSendToContact}
          iconName={'north-east'}
          IconComponent={MaterialIcon}
        />
        <BarButtonGroupIcon
          onPress={onShareContact}
          iconName={'share-alt'}
          IconComponent={FontAwesome5Icon}
        />
      </BarButtonGroupContainer>
      <View style={sharedStyles.screen}>
        <FormProvider {...methods}>
          <Input
            containerStyle={styles.usernameInputContainer}
            label={t('contacts_username_input_label')}
            inputName={'username'}
            rightIcon={copyButtonConfig}
            isReadOnly
            onRightIconPress={onCopyValue(getValues('username'))}
          />
          <Input
            containerStyle={styles.addressInputContainer}
            label={t('contacts_address_input_label')}
            inputName={'address'}
            rightIcon={copyButtonConfig}
            isReadOnly
            onRightIconPress={onCopyValue(getValues('address'))}
          />
        </FormProvider>
        <Typography
          type={'h3'}
          color={sharedColors.labelLight}
          style={styles.transactionsLabel}>
          {t('contacts_details_transactions')}
        </Typography>
        {/* will be available once we connect transactions with contacts */}
        {/* <ScrollView>
          {contact.transactions.map(c, index) => <ActivityBasicRow />}
        </ScrollView> */}
        <AppButton
          style={styles.editContactButton}
          title={t('contacts_details_edit_contact')}
          onPress={() =>
            navigation.navigate(contactsStackRouteNames.ContactForm, {
              initialValue: contact,
            })
          }
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  contactDetailsView: castStyle.view({
    backgroundColor: sharedColors.inputInactive,
    justifyContent: 'center',
    alignItems: 'center',
    height: 167,
    flexDirection: 'row',
    paddingHorizontal: 30,
  }),
  nameAddressView: castStyle.view({ flex: 1, marginLeft: 18 }),
  usernameInputContainer: castStyle.view({ marginTop: 25 }),
  addressInputContainer: castStyle.view({ marginTop: 10 }),
  transactionsLabel: castStyle.text({ marginTop: 34 }),
  editContactButton: castStyle.view({
    height: 54,
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
})
