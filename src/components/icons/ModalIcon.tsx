import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const ModalIcon = (props: SvgProps) => (
  <Svg height={24} width={24} {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill={props.color}
      d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM19 14.9 14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1v5.8z"
    />
    <Circle cx={12} cy={16} r={1} fill={props.color} />
    <Path d="M11 7h2v7h-2z" fill={props.color} />
  </Svg>
)
