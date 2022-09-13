import * as React from 'react'
import Svg, { Circle, Defs, G, Path, SvgProps } from 'react-native-svg'

const DappsIcon = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <G filter="url(#a)" stroke="#DBE3FF">
      <Path d="M9 3.468h6.5M8.154 5.545l3.461 5.539" />
      <Circle cx={6.769} cy={3.468} r={2.269} />
      <Circle cx={17.846} cy={3.468} r={2.269} />
      <Circle cx={12.308} cy={13.161} r={2.269} />
    </G>
    <Defs />
  </Svg>
)

export default DappsIcon
