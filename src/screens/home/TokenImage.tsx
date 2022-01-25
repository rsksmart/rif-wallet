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
    case 'RDOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rdoc.png')}
          style={iconStyle}
        />
      )
    case 'RIFP':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rifpro.png')}
          style={iconStyle}
        />
      )
    case 'BPro':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/bpro.png')}
          style={iconStyle}
        />
      )
    case 'RNS':
    case 'tRNS':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/bpro.png')}
          style={iconStyle}
        />
      )
    case 'INV':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/inv.png')}
          style={iconStyle}
        />
      )
    case 'rDAI':
    case 'rKovDAI':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/dai.png')}
          style={iconStyle}
        />
      )
    case 'WRBTC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/wrbtc.png')}
          style={iconStyle}
        />
      )
    case '🦄RBTC:RIF':
    case '🦄RBTC:tRIF':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rif-rbtc.png')}
          style={iconStyle}
        />
      )
    case '🦄RIF:DOC':
    case '🦄tRIF:DOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rif-doc.png')}
          style={iconStyle}
        />
      )
    case '🦄BPRO:DOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/bpro-doc.png')}
          style={iconStyle}
        />
      )
    case '🦄RDOC:DOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rdoc-doc.png')}
          style={iconStyle}
        />
      )
    case '🦄DAI:DOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rdai-doc.png')}
          style={iconStyle}
        />
      )
    case '🦄rDAI:RBTC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rdai-rbtc.png')}
          style={iconStyle}
        />
      )
    case '🦄RIF:rDAI':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rif-rdai.png')}
          style={iconStyle}
        />
      )
    case 'rFLIXX':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/flixx.png')}
          style={iconStyle}
        />
      )
    case 'rLINK':
    case 'rKovLINK':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/link.png')}
          style={iconStyle}
        />
      )
    case 'rUSDC':
    case 'rKovUSDC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/usdc.png')}
          style={iconStyle}
        />
      )
    case 'rUSDT':
    case 'rKovUSDT':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/usdt.png')}
          style={iconStyle}
        />
      )
    case 'rRFOX':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/rfox.png')}
          style={iconStyle}
        />
      )
    case 'crUSDT':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/crusdt.png')}
          style={iconStyle}
        />
      )
    case 'cRIF':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/crif.png')}
          style={iconStyle}
        />
      )
    case 'cRBTC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/crbtc.png')}
          style={iconStyle}
        />
      )
    case 'rBUND':
    case 'rKovBUND':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/bund.png')}
          style={iconStyle}
        />
      )
    case 'rAMLT':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/amlt.png')}
          style={iconStyle}
        />
      )
    case 'SOV':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/sov.png')}
          style={iconStyle}
        />
      )
    case 'MOC':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/moc.png')}
          style={iconStyle}
        />
      )
    case 'rUBI':
    case 'rKovUBI':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/ubi.png')}
          style={iconStyle}
        />
      )
    case 'ARSCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/arscb.png')}
          style={iconStyle}
        />
      )
    case 'USDCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/usdcb.png')}
          style={iconStyle}
        />
      )
    case 'VESCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/vescb.png')}
          style={iconStyle}
        />
      )
    case 'COPCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/copcb.png')}
          style={iconStyle}
        />
      )
    case 'BRLCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/brlcb.png')}
          style={iconStyle}
        />
      )
    case 'EURCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/eurcb.png')}
          style={iconStyle}
        />
      )
    case 'PABCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/pabcb.png')}
          style={iconStyle}
        />
      )
    case 'PYGCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/pygcb.png')}
          style={iconStyle}
        />
      )
    case 'PENCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/pencb.png')}
          style={iconStyle}
        />
      )
    case 'CNYCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/cnycb.png')}
          style={iconStyle}
        />
      )
    case 'MXNCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/mxncb.png')}
          style={iconStyle}
        />
      )
    case 'BOBCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/bobcb.png')}
          style={iconStyle}
        />
      )
    case 'IDRCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/idrcb.png')}
          style={iconStyle}
        />
      )
    case 'UYUCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/uyucb.png')}
          style={iconStyle}
        />
      )
    case 'BTCCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/btccb.png')}
          style={iconStyle}
        />
      )
    case 'ETHCB':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/ethcb.png')}
          style={iconStyle}
        />
      )
    case 'BRZ':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/brz.png')}
          style={iconStyle}
        />
      )
    case 'XUSD':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/xusd.svg')}
          style={iconStyle}
        />
      )
    case 'FISH':
      return (
        <Image
          source={require('@rsksmart/rsk-contract-metadata/images/fish.png')}
          style={iconStyle}
        />
      )

    default:
      return <FrownFaceIcon height={iconStyle.height} width={iconStyle.width} />
  }
}
