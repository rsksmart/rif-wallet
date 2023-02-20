import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {Input, Typography} from 'src/components'
import { sharedColors } from 'shared/constants'
import { FormProvider, useForm } from 'react-hook-form'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import {useTranslation} from "react-i18next";

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export type ReceiveScreenProps = {
  username: string
  displayAddress: string
  addressToCopy?: string
}

export const ReceiveScreen = ({
  username = 'user345crypto.rsk',
  addressToCopy,
  displayAddress,
}: ReceiveScreenProps) => {
  const { t } = useTranslation();
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  })

  const bitcoinCore = useBitcoinContext()

  const addressToUse = useMemo(
    () => addressToCopy || displayAddress,
    [addressToCopy, displayAddress],
  )

  return (
    <ScrollView style={styles.parent}>
      <FormProvider {...methods}>
        {/* Change Asset Component */}
        <Typography type="h4">{t('CHANGE_ASSET')}</Typography>
        <View style={{ flexDirection: 'row' }}>
          <PortfolioCard
            onPress={() => console.log('test')}
            color={sharedColors.inputInactive}
            primaryText="tRIF"
            secondaryText={'$21,000.00'}
            isSelected={false}
          />
          <PortfolioCard
            onPress={() => console.log('test')}
            color={sharedColors.inputInactive}
            primaryText="BTCT"
            secondaryText={'$21,000.00'}
            isSelected={false}
          />
        </View>
        {/* QR Component */}
        <View
          style={styles.qrView}>
          <QRGenerator 
            value={addressToUse}
            imageSource={require('../../images/arrow-up-icon.png')}
          />
        </View>
        {/* Username Component */}
        <Input
          label="Username"
          inputName="username"
          rightIcon={<Ionicons name="share-outline" size={20} />}
          placeholder={username}
          isReadOnly
        />
        {/* Address Component */}
        <Input
          label="Address"
          inputName="address"
          rightIcon={<Ionicons name="share-outline" size={20} />}
          placeholder={displayAddress}
          isReadOnly
        />
      </FormProvider>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: sharedColors.secondary,
    minHeight: '100%',
    paddingHorizontal: 24,
  },
  qrView: {
    paddingHorizontal: 45,
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 84,
    borderRadius: 20,
  },
})
