import * as React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

const HomeSelectedIcon = (props: SvgProps) => (
  <Svg width={14} height={17} fill="none" {...props}>
    <Path
      d="M1 7.18v9.211h12v-9.21L7 .699 1 7.18Z"
      fill="#DBE3FF"
      stroke="#DBE3FF"
      strokeLinejoin="round"
    />
  </Svg>
)

export default HomeSelectedIcon
