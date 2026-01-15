import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'
import { AppButton, Typography } from 'src/components'

import { ParsedTypedData, WalletConnectSigningRequest } from './types'

interface WalletConnectSigningModalProps {
  request: WalletConnectSigningRequest
  onConfirm: () => void
  onReject: () => void
}

const parseTypedDataParams = (params: unknown[]): ParsedTypedData | null => {
  try {
    // params[0] is the address, params[1] is the typed data JSON string
    const typedDataString = params[1] as string
    const parsed = JSON.parse(typedDataString)
    return {
      domain: parsed.domain || {},
      message: parsed.message || {},
      types: parsed.types || {},
    }
  } catch {
    return null
  }
}

const formatMessageValue = (value: unknown): string => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

export const WalletConnectSigningModal = ({
  request,
  onConfirm,
  onReject,
}: WalletConnectSigningModalProps) => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const { method, params, dappName, dappUrl } = request

  const isTypedData =
    method === 'eth_signTypedData' || method === 'eth_signTypedData_v4'
  const parsedTypedData = isTypedData ? parseTypedDataParams(params) : null

  const renderTypedDataContent = () => {
    if (!parsedTypedData) {
      return (
        <Typography type="body2" style={styles.warningText}>
          {t('wallet_connect_signing_parse_error')}
        </Typography>
      )
    }

    const { domain, message } = parsedTypedData

    return (
      <>
        {/* Domain Section */}
        <Typography type="h3" style={styles.sectionHeader}>
          {t('wallet_connect_signing_domain')}
        </Typography>
        <View style={styles.dataContainer}>
          {domain.name && (
            <View style={styles.dataRow}>
              <Typography type="body3" color={sharedColors.labelLight}>
                {t('wallet_connect_signing_name')}:
              </Typography>
              <Typography type="body2" style={styles.dataValue}>
                {domain.name}
              </Typography>
            </View>
          )}
          {domain.verifyingContract && (
            <View style={styles.dataRow}>
              <Typography type="body3" color={sharedColors.labelLight}>
                {t('wallet_connect_signing_contract')}:
              </Typography>
              <Typography
                type="body2"
                style={[styles.dataValue, styles.addressText]}>
                {domain.verifyingContract}
              </Typography>
            </View>
          )}
          {domain.chainId && (
            <View style={styles.dataRow}>
              <Typography type="body3" color={sharedColors.labelLight}>
                {t('wallet_connect_signing_chain_id')}:
              </Typography>
              <Typography type="body2" style={styles.dataValue}>
                {domain.chainId}
              </Typography>
            </View>
          )}
        </View>

        {/* Message Section */}
        <Typography type="h3" style={styles.sectionHeader}>
          {t('wallet_connect_signing_message')}
        </Typography>
        <View style={styles.dataContainer}>
          {Object.entries(message).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Typography type="body3" color={sharedColors.labelLight}>
                {key}:
              </Typography>
              <Typography type="body2" style={styles.dataValue}>
                {formatMessageValue(value)}
              </Typography>
            </View>
          ))}
        </View>
      </>
    )
  }

  const renderPersonalSignContent = () => {
    const message = params[0] as string
    let decodedMessage: string

    try {
      // Try to decode hex message
      if (message.startsWith('0x')) {
        const hex = message.slice(2)
        decodedMessage = Buffer.from(hex, 'hex').toString('utf8')
      } else {
        decodedMessage = message
      }
    } catch {
      decodedMessage = message
    }

    return (
      <>
        <Typography type="h3" style={styles.sectionHeader}>
          {t('wallet_connect_signing_message')}
        </Typography>
        <View style={styles.messageContainer}>
          <Typography type="body2">{decodedMessage}</Typography>
        </View>
      </>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 40 }]}>
      {/* Header */}
      <Typography type="h2" style={styles.header}>
        {t('wallet_connect_signing_request_title')}
      </Typography>

      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Typography type="body3" color={sharedColors.warning}>
          ⚠️ {t('wallet_connect_signing_warning')}
        </Typography>
      </View>

      {/* dApp Info */}
      {(dappName || dappUrl) && (
        <View style={styles.dappInfo}>
          <Typography type="body3" color={sharedColors.labelLight}>
            {t('wallet_connect_signing_requested_by')}:
          </Typography>
          <Typography type="body2">{dappName || dappUrl}</Typography>
        </View>
      )}

      {/* Method */}
      <View style={styles.methodContainer}>
        <Typography type="body3" color={sharedColors.labelLight}>
          {t('wallet_connect_signing_method')}:
        </Typography>
        <Typography type="body2" style={styles.methodText}>
          {method}
        </Typography>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {isTypedData && renderTypedDataContent()}
        {method === 'personal_sign' && renderPersonalSignContent()}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <AppButton
          accessibilityLabel="Confirm"
          title={t('wallet_connect_signing_sign')}
          onPress={onConfirm}
          color={sharedColors.white}
          textColor={sharedColors.black}
          style={styles.confirmButton}
        />
        <AppButton
          accessibilityLabel="Cancel"
          title={t('wallet_connect_signing_reject')}
          onPress={onReject}
          color={sharedColors.danger}
          textColor={sharedColors.white}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: sharedColors.black,
    zIndex: 999,
    paddingHorizontal: 24,
  }),
  header: castStyle.text({
    marginBottom: 16,
  }),
  warningBanner: castStyle.view({
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: sharedColors.warning,
  }),
  dappInfo: castStyle.view({
    marginBottom: 12,
  }),
  methodContainer: castStyle.view({
    marginBottom: 16,
  }),
  methodText: castStyle.text({
    fontFamily: 'monospace',
  }),
  scrollContent: castStyle.view({
    flex: 1,
    marginBottom: 16,
  }),
  sectionHeader: castStyle.text({
    marginTop: 16,
    marginBottom: 8,
    color: sharedColors.white,
  }),
  dataContainer: castStyle.view({
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  }),
  dataRow: castStyle.view({
    marginBottom: 8,
  }),
  dataValue: castStyle.text({
    marginTop: 4,
  }),
  addressText: castStyle.text({
    fontFamily: 'monospace',
    fontSize: 12,
  }),
  messageContainer: castStyle.view({
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  }),
  warningText: castStyle.text({
    color: sharedColors.danger,
  }),
  buttonsContainer: castStyle.view({
    paddingBottom: 20,
  }),
  confirmButton: castStyle.view({
    marginBottom: 12,
  }),
})
