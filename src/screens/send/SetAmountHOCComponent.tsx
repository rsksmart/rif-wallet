import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { BitcoinSetAmountContainer } from './BitcoinSetAmountContainer'
import { ISetAmountComponent } from './SetAmountComponent'
import { SetAmountRifComponent } from './SetAmountRifComponent'
import { MixedTokenAndNetworkType } from './types'

type SetAmountHOCComponenProps = Omit<ISetAmountComponent, 'token'> & {
  token: MixedTokenAndNetworkType
}
export const SetAmountHOCComponent = ({
  setAmount,
  token,
  usdAmount,
}: SetAmountHOCComponenProps) => {
  if ('isBitcoin' in token) {
    return <BitcoinSetAmountContainer setAmount={setAmount} token={token} />
  }
  return (
    <SetAmountRifComponent
      setAmount={setAmount}
      token={token as ITokenWithBalance}
      usdAmount={usdAmount}
    />
  )
}
