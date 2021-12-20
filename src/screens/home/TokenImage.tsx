import React from 'react'
import { Image } from 'react-native'
import { FrownFaceIcon } from '../../components/icons'

export const TokenImage: React.FC<{
  symbol: string
  height?: number
  width?: number
}> = ({ symbol, height, width }) => {
  const iconStyle = {
    height: height || 20,
    width: width || 20,
  }

  switch (symbol) {
    case 'TRBTC':
      return (
        <Image
          source={require('../../images/RBTC-logo.png')}
          style={iconStyle}
        />
      )
    case 'RIF':
    case 'tRIF':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rif.png')}
          style={iconStyle}
        />
      )
    case 'DOC':
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
