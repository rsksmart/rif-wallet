import * as React from 'react'
import Svg, { Circle, Path, SvgProps } from 'react-native-svg'

const DappsSelectedIcon = (props: SvgProps) => (
  <Svg width={17} height={17} fill="none" {...props}>
    <Path d="M5 3.7h6.5M4.154 5.776l3.461 5.539" stroke="#DBE3FF" />
    <Circle cx={2.769} cy={3.699} r={2.269} fill="#DBE3FF" stroke="#DBE3FF" />
    <Circle cx={13.846} cy={3.699} r={2.269} fill="#DBE3FF" stroke="#DBE3FF" />
    <Circle cx={8.308} cy={13.392} r={2.269} fill="#DBE3FF" stroke="#DBE3FF" />
  </Svg>
)

export default DappsSelectedIcon
