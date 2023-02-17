import Svg, { SvgProps, Path } from 'react-native-svg'

const MinusIcon = (props: SvgProps) => (
  <Svg width={15} height={3} fill="none" {...props}>
    <Path
      d="M14.464 1.51a.798.798 0 0 1-.803.798H1.339a.8.8 0 0 1-.803-.797c0-.439.36-.797.803-.797h12.322a.8.8 0 0 1 .803.797Z"
      fill={props.color || '#FBFBFB'}
    />
  </Svg>
)

export default MinusIcon
