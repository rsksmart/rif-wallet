import { useEffect, useState } from 'react'
import { convertBtcToSatoshi } from '@rsksmart/rif-wallet-bitcoin'

import { useAppSelector } from 'store/storeUtils'
import { selectBitcoin } from 'store/slices/settingsSlice'
import { Typography } from 'src/components'
import { sharedStyles } from 'shared/styles'

export const BitcoinMiningFeeContainer = () => {
  const bitcoinCore = useAppSelector(selectBitcoin)
  const [suggestedBitcoinFees, setSuggestedBitcoinFees] = useState<
    { feeName: string; feeRate: string }[]
  >([])

  useEffect(() => {
    // Fetch the bitcoin fees
    bitcoinCore?.networksArr[0].bips[0].fetcher
      .fetchBitcoinMiningFeeRates('cypher')
      .then(cypherResponse => {
        setSuggestedBitcoinFees([
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
        ])
      })
      .catch(() => {
        // Fetch from blockbook if cypher fails

        bitcoinCore?.networksArr[0].bips[0].fetcher
          .fetchBitcoinMiningFeeRates('blockbook')
          .then(blockbookResponse => {
            setSuggestedBitcoinFees([
              {
                feeName: 'low',
                feeRate: convertBtcToSatoshi(
                  blockbookResponse.result,
                ).toString(),
              },
            ])
          })
      })
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
