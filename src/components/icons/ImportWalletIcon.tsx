import Svg, { Path, SvgProps } from 'react-native-svg'

import { SVGIconInterface } from './index'

export const ImportWalletIcon = (props: SvgProps & SVGIconInterface) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -9 22 45"
      width={width || 53}
      height={height || 53}
      fill={color || '#5D5E5E'}>
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" />
    </Svg>
  )
}
