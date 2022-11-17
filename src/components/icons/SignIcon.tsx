import Svg, { SvgProps, Path } from 'react-native-svg'

export const SignIcon = (props: SvgProps) => (
  <Svg height={24} width={24} {...props}>
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill={props.color}
      d="M22 24H2v-4h20v4zM13.06 5.19l3.75 3.75L7.75 18H4v-3.75l9.06-9.06zm4.82 2.68-3.75-3.75 1.83-1.83a.996.996 0 0 1 1.41 0l2.34 2.34c.39.39.39 1.02 0 1.41l-1.83 1.83z"
    />
  </Svg>
)
