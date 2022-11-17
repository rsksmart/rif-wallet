import Svg, { SvgProps, Path, G, PathProps } from 'react-native-svg'

// export this for Send and Faucet
export interface ReceiveIconInterface extends SvgProps {
  color: string
}

export const sendRecieveSvgShared: { [k: string]: PathProps } = {
  st0: {
    opacity: 0.29,
    fill: '#DBE1F3',
  },
  arrow: {
    fill: 'none',
    stroke: '#DBE1F3',
    strokeWidth: 2,
    strokeLinecap: 'round',
  },
}

const ReceiveIcon = (props: ReceiveIconInterface) => {
  const st1: PathProps = {
    fill: props.color === '#CCCCCC' ? '#DBE1F3' : props.color,
  }

  return (
    <Svg height={25} width={25} viewBox="0 0 25 25" {...props}>
      <G>
        <Path
          {...sendRecieveSvgShared.st0}
          d="M3.3,8.3h18.4c1.1,0,2,0.9,2,2v9.8c0,1.1-0.9,2-2,2H3.3c-1.1,0-2-0.9-2-2v-9.8
		C1.3,9.2,2.2,8.3,3.3,8.3z"
        />
        <Path
          {...st1}
          d="M22.4,13.9h-4.6c-1.1,0-2.2,0.5-2.9,1.3c-0.6,0.7-1.5,1.1-2.4,1.1c-0.9,0-1.8-0.4-2.4-1.1
		c-0.7-0.8-1.8-1.3-2.9-1.3H2.6c-0.7,0-1.3,0.6-1.4,1.3c0,0,0,0,0,0V21c0,0.7,0.6,1.3,1.4,1.3c0,0,0,0,0,0h19.7
		c0.7,0,1.4-0.6,1.4-1.3c0,0,0,0,0,0v-5.8C23.7,14.5,23.1,13.9,22.4,13.9C22.4,13.9,22.4,13.9,22.4,13.9"
        />
        <Path {...sendRecieveSvgShared.arrow} d="M15.8,6.5l-3.5,3.2L8.9,6.5" />
        <Path {...sendRecieveSvgShared.arrow} d="M12.4,9.4V2.7" />
      </G>
    </Svg>
  )
}
export default ReceiveIcon
