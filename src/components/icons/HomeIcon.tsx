import * as React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

const HomeIcon = (props: SvgProps) => (
  <Svg width={14} height={18} fill="none" {...props}>
    <Path
      d="M1 7.488v9.21h12v-9.21L7 1.007 1 7.488Z"
      stroke="#DBE3FF"
      strokeLinejoin="round"
    />
  </Svg>
)

export default HomeIcon
