import { useEffect, useState } from 'react'
import { convertBtcToSatoshi } from '@rsksmart/rif-wallet-bitcoin'

import { useAppSelector } from 'store/storeUtils'
import { selectBitcoin } from 'store/slices/settingsSlice'
import { Typography } from 'src/components'
import { sharedStyles } from 'shared/styles'

export interface FeeRecord {
  feeName: string
  feeRate: string
}

interface BitcoinMiningFeeContainerProps {
  onFeeRatesLoaded?: (rates: FeeRecord[]) => void
}

export const BitcoinMiningFeeContainer = ({
  onFeeRatesLoaded,
}: BitcoinMiningFeeContainerProps) => {
  const bitcoinCore = useAppSelector(selectBitcoin)
  const [suggestedBitcoinFees, setSuggestedBitcoinFees] = useState<FeeRecord[]>(
    [],
  )

  useEffect(() => {
    // Fetch the bitcoin fees
    bitcoinCore?.networksArr[0].bips[0].fetcher
      .fetchBitcoinMiningFeeRates('cypher')
      .then(cypherResponse => {
        const suggestedBitcoinFeesData = [
          {
            feeName: 'low',
            feeRate: cypherResponse.low_fee_per_kb.toString(),
          },
          {
            feeName: 'medium',
            feeRate: cypherResponse.medium_fee_per_kb.toString(),
          },
          {
            feeName: 'high',
            feeRate: cypherResponse.high_fee_per_kb.toString(),
          },
        ]
        setSuggestedBitcoinFees(suggestedBitcoinFeesData)
        onFeeRatesLoaded?.(suggestedBitcoinFeesData)
      })
      .catch(() => {
        // Fetch from blockbook if cypher fails

        bitcoinCore?.networksArr[0].bips[0].fetcher
          .fetchBitcoinMiningFeeRates('blockbook')
          .then(blockbookResponse => {
            const suggestedBitcoinFeesData = [
              {
                feeName: 'low',
                feeRate: convertBtcToSatoshi(
                  blockbookResponse.result,
                ).toString(),
              },
            ]
            setSuggestedBitcoinFees(suggestedBitcoinFeesData)
            onFeeRatesLoaded?.(suggestedBitcoinFeesData)
          })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitcoinCore])

  return (
    <>
      <Typography type="h4" style={sharedStyles.marginTop20}>
        Fee rates:
      </Typography>
      {suggestedBitcoinFees.map(fee => (
        <Typography
          type="h4"
          key={fee.feeName}
          style={sharedStyles.marginTop10}>
          {fee.feeName}: {fee.feeRate} satoshis
        </Typography>
      ))}
    </>
  )
}
