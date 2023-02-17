import Svg, { SvgProps, Path } from 'react-native-svg'

const PlusIcon = (props: SvgProps) => (
  <Svg width={14} height={15} fill="none" {...props}>
    <Path
      d="M13.5 7.51c0 .442-.334.797-.75.797h-5v5.313c0 .44-.336.797-.75.797s-.75-.356-.75-.797V8.307h-5c-.414 0-.75-.356-.75-.796 0-.439.336-.798.75-.798h5V1.401c0-.44.336-.797.75-.797s.75.357.75.797v5.312h5c.416 0 .75.359.75.797Z"
      fill={props.color || '#FBFBFB'}
    />
  </Svg>
)

export default PlusIcon
