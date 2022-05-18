import React from 'react'
import Svg, { Path, PathProps } from 'react-native-svg'
import { ReceiveIconInterface, sendRecieveSvgShared } from './ReceiveIcon'

// Exchange & Faucet Icon
const ExchangeIcon = (props: ReceiveIconInterface) => {
  const st1: PathProps = {
    fill: props.color === '#CCCCCC' ? '#DBE1F3' : props.color,
  }

  return (
    <Svg height={25} width={25} viewBox="0 0 25 25" {...props}>
      <Path
        {...sendRecieveSvgShared.st0}
        d="M3.3,7.8h18.3c1.1,0,2,0.9,2,2v9.7c0,1.1-0.9,2-2,2H3.3c-1.1,0-2-0.9-2-2V9.8
	C1.3,8.7,2.2,7.8,3.3,7.8z"
      />
      <Path
        {...st1}
        d="M22.3,13.3h-4.6c-1.1,0-2.2,0.5-2.9,1.3c-0.6,0.7-1.5,1.1-2.4,1.1c-0.9,0-1.8-0.4-2.4-1.1
	c-0.7-0.8-1.8-1.3-2.9-1.3H2.7c-0.7,0-1.3,0.6-1.3,1.3v5.7c0,0.7,0.6,1.3,1.3,1.3h19.6c0.7,0,1.3-0.6,1.3-1.3v-5.7
	C23.7,13.9,23.1,13.3,22.3,13.3"
      />
      <Path {...sendRecieveSvgShared.arrow} d="M19.2,3.3v7" />
      <Path {...sendRecieveSvgShared.arrow} d="M15.7,6.8h7" />
    </Svg>
  )
}
export default ExchangeIcon
