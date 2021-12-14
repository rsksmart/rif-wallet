import React from 'react'
import { Image } from 'react-native'
import { FrownFaceIcon } from '../../styles/svgIcons'

export const TokenImage: React.FC<{
  logo: string
  height?: number
  width?: number
}> = ({ logo, height, width }) => {
  const iconStyle = {
    height: height || 20,
    width: width || 20,
  }
  switch (logo) {
    case 'TRBTC':
      return (
        <Image
          source={require('../../images/RBTC-logo.png')}
          style={iconStyle}
        />
      )
    case 'rif.png':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rif.png')}
          style={iconStyle}
        />
      )
    case 'doc.png':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/doc.png')}
          style={iconStyle}
        />
      )
    default:
      return <FrownFaceIcon height={iconStyle.height} width={iconStyle.width} />
  }
}
