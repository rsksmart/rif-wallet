import Svg, { Path, G, Circle } from 'react-native-svg'
import { SVGIconInterface } from './index'

export const DefiIcon = ({ height, width, style }: SVGIconInterface) => (
  <Svg
    x="0px"
    y="0px"
    viewBox="0 0 27 22"
    style={style}
    height={height || 22}
    width={width || 27}>
    <G transform="translate(-228.922 -670)">
      <Path
        stroke="#A2A1D0"
        d="M239.4,672.4l-8,10.2h13.9l7.5,7.2l0.7-16.6l-7.7,8.6L239.4,672.4z"
      />
      <G transform="translate(236.922 670)">
        <Circle fill="#A2A1D0" cx="2.5" cy="2.5" r="2" />
        <Circle stroke="#A2A1D0" cx="2.5" cy="2.5" r="1.5" />
      </G>
      <G transform="translate(228.922 680)">
        <Circle fill="#A2A1D0" cx="2.5" cy="2.5" r="2" />
        <Circle stroke="#A2A1D0" cx="2.5" cy="2.5" r="1.5" />
      </G>
      <G transform="translate(249.922 687)">
        <Circle fill="#A2A1D0" cx="2.5" cy="2.5" r="2" />
        <Circle stroke="#A2A1D0" cx="2.5" cy="2.5" r="1.5" />
      </G>
      <G transform="translate(250.922 671)">
        <Circle fill="#A2A1D0" cx="2.5" cy="2.5" r="2" />
        <Circle stroke="#A2A1D0" cx="2.5" cy="2.5" r="1.5" />
      </G>
      <G transform="translate(234.632 685.581) rotate(-65)">
        <G transform="matrix(0.719, 0.695, -0.695, 0.719, 4.928, 0)">
          <Path
            fill="#A2A1D0"
            d="M0.3,4.8c0-0.1,0-0.2,0-0.3C0.2,4,0.5,3.4,1,3.3c0.1,0,0.2,0,0.3,0h0.2
				c1.7-0.9,3.7-1.4,5.6-1.3c2-0.1,3.9,0.4,5.6,1.3h0.2c0.5,0,1,0.4,1,1c0,0.1,0,0.2,0,0.3c0,0.1,0,0.2,0,0.3c0,1.6-3,2.9-6.8,2.9
				C3.3,7.7,0.3,6.4,0.3,4.8z"
          />
          <Path
            fill="#ADE1F3"
            d="M7,0.6c3.7,0,6.8,1.3,6.8,2.9s-3,2.9-6.8,2.9c-3.7,0-6.8-1.3-6.8-2.9S3.3,0.6,7,0.6z"
          />
        </G>
      </G>
    </G>
  </Svg>
)
