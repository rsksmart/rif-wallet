import React from 'react'
import Svg, { Path, G, PathProps } from 'react-native-svg'
import { ReceiveIconInterface, sendRecieveSvgShared } from './ReceiveIcon'

const SendIcon = (props: ReceiveIconInterface) => {
  const st1: PathProps = {
    fill: props.color === '#CCCCCC' ? '#DBE1F3' : props.color,
  }

  return (
    <Svg height={25} width={25} viewBox="0 0 25 25" {...props}>
      <G>
        <Path
          {...sendRecieveSvgShared.st0}
          d="M3.3,7.9h18.3c1.1,0,2,0.9,2,2v9.7c0,1.1-0.9,2-2,2H3.3c-1.1,0-2-0.9-2-2V9.9
	C1.3,8.8,2.2,7.9,3.3,7.9z"
        />
        <Path
          {...st1}
          d="M22.3,13.4h-4.6c-1.1,0-2.2,0.5-2.9,1.3c-0.6,0.7-1.5,1.1-2.4,1.1c-0.9,0-1.8-0.4-2.4-1.1
	c-0.7-0.8-1.8-1.3-2.9-1.3H2.7c-0.7,0-1.3,0.6-1.3,1.3v5.7c0,0.7,0.6,1.3,1.3,1.3h19.6c0.7,0,1.3-0.6,1.3-1.3v-5.7
	C23.7,14,23.1,13.4,22.3,13.4"
        />
        <Path {...sendRecieveSvgShared.arrow} d="M9.3,6.5l3.6-3.4l3.5,3.4" />
        <Path {...sendRecieveSvgShared.arrow} d="M12.8,3.5v7" />
      </G>
    </Svg>
  )
}
export default SendIcon
