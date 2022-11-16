import Svg, { SvgProps, Path, G, Line } from 'react-native-svg'

interface HideShowInterface extends SvgProps {
  isHidden: boolean
}

export const HideShowIcon = (props: HideShowInterface) => (
  <Svg {...props} viewBox="0 0 12 7">
    <G id="Group_1204" transform="translate(0)">
      <Path
        fill="#171530"
        d="M5.6,7H5.2L5,7c-0.3,0-0.7-0.1-1-0.2c-0.7-0.2-1.3-0.5-1.8-1C1.3,5.2,0.6,4.4,0.2,3.4
				c0,0,0-0.1,0-0.1C0.6,2.4,1.2,1.6,2,0.9c1.3-1.1,3-1.4,4.6-1C7.4,0.1,8.2,0.5,8.8,1c0.6,0.6,1.2,1.2,1.6,2
				c0.1,0.1,0.1,0.2,0.2,0.4v0c0,0,0,0,0,0c-0.3,0.7-0.8,1.3-1.3,1.9c-0.5,0.5-1.1,1-1.7,1.3C7,6.8,6.5,7,5.9,7L5.6,7 M5.4,1
				C4.1,1,3,2.1,3,3.4s1.1,2.4,2.3,2.4c1.3,0,2.4-1.1,2.4-2.3c0,0,0,0,0,0C7.7,2.1,6.7,1,5.4,1"
      />
      <Path
        fill="#171530"
        d="M5.4,2.1c0.7,0,1.3,0.6,1.3,1.3c0,0.7-0.6,1.3-1.3,1.3c-0.7,0-1.3-0.6-1.3-1.3
				C4.1,2.7,4.6,2.1,5.4,2.1"
      />
      {props.isHidden && (
        <Line stroke="#171530" strokeWidth={1.5} x1={11} y1={0} x2={1} y2={7} />
      )}
    </G>
  </Svg>
)
