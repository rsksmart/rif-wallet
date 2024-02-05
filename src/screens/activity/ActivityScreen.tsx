import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import { ChainID } from 'lib/eoaWallet'

import { Typography } from 'components/typography'
import { abiEnhancer } from 'core/setup'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors, sharedStyles } from 'shared/constants'
import { ActivityMainScreenProps } from 'shared/types'
import { castStyle } from 'shared/utils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { fetchBitcoinTransactions } from 'store/slices/transactionsSlice'
import {
  selectTransactions,
  selectTransactionsLoading,
} from 'store/slices/transactionsSlice/selectors'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { useWallet } from 'shared/wallet'

import { ActivityBasicRow } from './ActivityRow'

export const ActivityScreen = ({ navigation }: ActivityMainScreenProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const wallet = useWallet()
  const transactions = useAppSelector(selectTransactions)
  const loading = useAppSelector(selectTransactionsLoading)
  const isFocused = useIsFocused()

  const onRefresh = () => dispatch(fetchBitcoinTransactions({}))

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.black))
    }
  }, [dispatch, isFocused])

  return (
    <View style={sharedStyles.screen}>
      <FlatList
        data={transactions}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.2}
        refreshing={loading}
        renderItem={({ item }) => (
          <ActivityBasicRow
            wallet={wallet}
            activityDetails={item}
            navigation={navigation}
            backScreen={rootTabsRouteNames.Activity}
          />
        )}
        style={styles.flatListView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={
          <View style={styles.title}>
            <Typography type="h2">{t('home_screen_transactions')}</Typography>
            {transactions.length === 0 && !loading && (
              <Typography type="h4" style={styles.listEmptyText}>
                {t('activity_list_empty')}
              </Typography>
            )}
          </View>
        }
        ListEmptyComponent={
          <>
            {!loading && (
              <Image
                source={require('/assets/images/no-transactions.png')}
                resizeMode="contain"
                style={styles.noTransactionImage}
              />
            )}
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  flatListView: castStyle.view({
    paddingBottom: 30,
    marginBottom: 300,
    minHeight: '100%',
  }),
  refreshButtonView: castStyle.view({
    paddingVertical: 15,
    alignContent: 'center',
    borderBottomColor: '#CCCCCC',
  }),
  title: castStyle.view({
    marginTop: 18,
  }),
  listEmptyText: castStyle.text({
    marginTop: 10,
  }),
  noTransactionImage: castStyle.image({
    alignSelf: 'center',
    width: '80%',
    height: 500,
  }),
})

export const enhanceTransactionInput = async (
  transaction: IApiTransaction,
  chainId: ChainID,
): Promise<EnhancedResult | null> => {
  try {
    const enhancedTx = await abiEnhancer.enhance(chainId, {
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
