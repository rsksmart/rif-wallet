import Svg, { Path, G } from 'react-native-svg'

import { SVGIconInterface } from './index'

export const WalletIcon = ({ height, width, style }: SVGIconInterface) => (
  <Svg
    x="0px"
    y="0px"
    viewBox="0 0 27 22"
    width={width || 27}
    height={height || 22}
    style={style}>
    <G transform="translate(0 -1)">
      <G transform="translate(0 0)">
        <Path
          opacity={0.6}
          fill="#DBE1F3"
          d="M2.6,6.5h21.7c1.3,0,2.3,1,2.3,2.3v11.3c0,1.3-1,2.3-2.3,2.3H2.6c-1.3,0-2.3-1-2.3-2.3
        V8.8C0.3,7.5,1.4,6.5,2.6,6.5z"
        />
        <G transform="translate(0 6.199)">
          <G transform="translate(0 0)">
            <Path
              id="Path_104"
              fill="#DBE1F3"
              d="M25.1,6.6h-5.4c-1.3,0-2.5,0.5-3.4,1.5c-0.7,0.9-1.7,1.3-2.8,1.3c-1.1,0-2.1-0.5-2.8-1.3
            c-0.8-1-2.1-1.6-3.4-1.5H1.9c-0.9,0-1.6,0.7-1.6,1.6v6.8c0,0.9,0.7,1.6,1.6,1.6h23.1c0.9,0,1.6-0.7,1.6-1.6V8.1
            C26.7,7.3,25.9,6.6,25.1,6.6"
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
