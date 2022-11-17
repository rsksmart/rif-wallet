import Svg, { SvgProps, Path } from 'react-native-svg'

const DeleteIcon = (props: SvgProps) => (
  <Svg height={24} width={24} {...props} viewBox={props.viewBox ?? '0 0 40 40'}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill={props.color}
      d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
      transform={'rotate(0, 50, 25)'}
    />
  </Svg>
)

export default DeleteIcon
