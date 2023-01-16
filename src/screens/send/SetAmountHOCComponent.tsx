import { ISetAmountComponent } from './SetAmountComponent'
import { MixedTokenAndNetworkType } from './types'
import { BitcoinSetAmountContainer } from './BitcoinSetAmountContainer'
import { SetAmountRifComponent } from './SetAmountRifComponent'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

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
  } else {
    return (
      <SetAmountRifComponent
        setAmount={setAmount}
        token={token as ITokenWithBalance}
        usdAmount={usdAmount}
      />
    )
  }
}
