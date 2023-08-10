import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { ethers } from 'ethers'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import { Typography } from 'components/typography'
import { abiEnhancer } from 'core/setup'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors } from 'shared/constants'
import { ActivityMainScreenProps } from 'shared/types'
import { castStyle } from 'shared/utils'
import { changeTopColor, selectWallet } from 'store/slices/settingsSlice'
import { fetchBitcoinTransactions } from 'store/slices/transactionsSlice'
import {
  selectTransactions,
  selectTransactionsLoading,
} from 'store/slices/transactionsSlice/selectors'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'

import { ActivityBasicRow } from './ActivityRow'

export const ActivityScreen = ({ navigation }: ActivityMainScreenProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const wallet = useAppSelector(selectWallet)
  const transactions = useAppSelector(selectTransactions)
  const areTransasctionsLoading = useAppSelector(selectTransactionsLoading)
  const isFocused = useIsFocused()

  const onRefresh = useCallback(() => {
    dispatch(fetchBitcoinTransactions({}))
  }, [dispatch])

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.secondary))
    }
  }, [dispatch, isFocused])

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={transactions}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.2}
        refreshing={areTransasctionsLoading}
        renderItem={({ item }) => (
          <ActivityBasicRow
            wallet={wallet}
            activityDetails={item}
            navigation={navigation}
            backScreen={rootTabsRouteNames.Activity}
          />
        )}
        style={styles.flatlistViewStyle}
        refreshControl={
          <RefreshControl
            refreshing={areTransasctionsLoading}
            tintColor="white"
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={
          <View style={styles.transactionsViewStyle}>
            <Typography type="h2">{t('home_screen_transactions')}</Typography>
            {transactions.length === 0 && !areTransasctionsLoading && (
              <Typography type="h4" style={styles.listEmptyTextStyle}>
                {t('activity_list_empty')}
              </Typography>
            )}
          </View>
        }
        ListEmptyComponent={
          <>
            {!areTransasctionsLoading && (
              <Image
                source={require('/assets/images/no-transactions.png')}
                resizeMode="contain"
                style={styles.imageStyle}
              />
            )}
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: castStyle.view({
    backgroundColor: sharedColors.secondary,
    flex: 1,
  }),
  flatlistViewStyle: castStyle.view({
    paddingBottom: 30,
    marginBottom: 300,
    paddingHorizontal: 15,
    minHeight: '100%',
  }),
  refreshButtonView: castStyle.view({
    paddingVertical: 15,
    alignContent: 'center',
    borderBottomColor: '#CCCCCC',
  }),
  transactionsViewStyle: castStyle.view({
    marginTop: 40,
    marginBottom: 20,
    paddingLeft: 15,
  }),
  listEmptyTextStyle: castStyle.text({
    marginTop: 10,
  }),
  imageStyle: castStyle.image({
    alignSelf: 'center',
    width: '80%',
    height: 500,
  }),
})

export const enhanceTransactionInput = async (
  transaction: IApiTransaction,
  wallet: RIFWallet,
): Promise<EnhancedResult | null> => {
  try {
    const enhancedTx = await abiEnhancer.enhance(wallet, {
      from: transaction.from.toLowerCase(),
      to: transaction.to.toLowerCase(),
      data: ethers.utils.arrayify(transaction.input),
      value: transaction.value,
    })
    return enhancedTx
  } catch (e) {
    return null
  }
}
