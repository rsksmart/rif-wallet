import React from 'react'
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import { FrownFaceIcon } from '../../components/icons'

export const TokenImage: React.FC<{
  symbol: string
  height?: number
  width?: number
}> = ({ symbol, height, width }) => {
  const viewStyle: StyleProp<ViewStyle> = {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const iconStyle: StyleProp<ImageStyle> = {
    height: height || 20,
    width: width || 20,
  }

  const src = getIconSource(symbol)
  if (src) {
    return (
      <View style={viewStyle}>
        <Image source={src} style={iconStyle} resizeMode="contain" />
      </View>
    )
  }

  return <FrownFaceIcon height={height} width={width} />
}

const getIconSource = (symbol: string): ImageRequireSource | undefined => {
  switch (symbol) {
    case 'TRBTC':
      return require('../../images/RBTC-logo.png')
    case 'RIF':
    case 'tRIF':
      return require('@rsksmart/rsk-contract-metadata/images/rif.png')
    case 'DOC':
      return require('@rsksmart/rsk-contract-metadata/images/doc.png')
    case 'rDOC':
      return require('@rsksmart/rsk-contract-metadata/images/rdoc.png')
    case 'RIFP':
      return require('@rsksmart/rsk-contract-metadata/images/rifpro.png')
    case 'BPro':
      return require('@rsksmart/rsk-contract-metadata/images/bpro.png')
    case 'RNS':
    case 'tRNS':
      return require('@rsksmart/rsk-contract-metadata/images/rif.png')
    case 'INV':
      return require('@rsksmart/rsk-contract-metadata/images/inv.png')
    case 'rDAI':
    case 'rKovDAI':
      return require('@rsksmart/rsk-contract-metadata/images/dai.png')
    case 'WRBTC':
      return require('@rsksmart/rsk-contract-metadata/images/wrbtc.png')
    case '🦄RBTC:RIF':
    case '🦄RBTC:tRIF':
      return require('@rsksmart/rsk-contract-metadata/images/rif-rbtc.png')
    case '🦄RIF:DOC':
    case '🦄tRIF:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rif-doc.png')
    case '🦄BPRO:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/bpro-doc.png')
    case '🦄RDOC:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rdoc-doc.png')
    case '🦄DAI:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rdai-doc.png')
    case '🦄rDAI:RBTC':
      return require('@rsksmart/rsk-contract-metadata/images/rdai-rbtc.png')
    case '🦄RIF:rDAI':
      return require('@rsksmart/rsk-contract-metadata/images/rif-rdai.png')
    case 'rFLIXX':
      return require('@rsksmart/rsk-contract-metadata/images/flixx.png')
    case 'rLINK':
    case 'rKovLINK':
      return require('@rsksmart/rsk-contract-metadata/images/link.png')
    case 'rUSDC':
    case 'rKovUSDC':
      return require('@rsksmart/rsk-contract-metadata/images/usdc.png')
    case 'rUSDT':
    case 'rKovUSDT':
      return require('@rsksmart/rsk-contract-metadata/images/usdt.png')
    case 'rRFOX':
      return require('@rsksmart/rsk-contract-metadata/images/rfox.png')
    case 'crUSDT':
      return require('@rsksmart/rsk-contract-metadata/images/crusdt.png')
    case 'cRIF':
      return require('@rsksmart/rsk-contract-metadata/images/crif.png')
    case 'cRBTC':
      return require('@rsksmart/rsk-contract-metadata/images/crbtc.png')
    case 'rBUND':
    case 'rKovBUND':
      return require('@rsksmart/rsk-contract-metadata/images/bund.png')
    case 'rAMLT':
      return require('@rsksmart/rsk-contract-metadata/images/amlt.png')
    case 'SOV':
      return require('@rsksmart/rsk-contract-metadata/images/sov.png')
    case 'MOC':
      return require('@rsksmart/rsk-contract-metadata/images/moc.png')
    case 'rUBI':
    case 'rKovUBI':
      return require('@rsksmart/rsk-contract-metadata/images/ubi.png')
    case 'ARSCB':
      return require('@rsksmart/rsk-contract-metadata/images/arscb.png')
    case 'USDCB':
      return require('@rsksmart/rsk-contract-metadata/images/usdcb.png')
    case 'VESCB':
      return require('@rsksmart/rsk-contract-metadata/images/vescb.png')
    case 'COPCB':
      return require('@rsksmart/rsk-contract-metadata/images/copcb.png')
    case 'BRLCB':
      return require('@rsksmart/rsk-contract-metadata/images/brlcb.png')
    case 'EURCB':
      return require('@rsksmart/rsk-contract-metadata/images/eurcb.png')
    case 'PABCB':
      return require('@rsksmart/rsk-contract-metadata/images/pabcb.png')
    case 'PYGCB':
      return require('@rsksmart/rsk-contract-metadata/images/pygcb.png')
    case 'PENCB':
      return require('@rsksmart/rsk-contract-metadata/images/pencb.png')
    case 'CNYCB':
      return require('@rsksmart/rsk-contract-metadata/images/cnycb.png')
    case 'MXNCB':
      return require('@rsksmart/rsk-contract-metadata/images/mxncb.png')
    case 'BOBCB':
      return require('@rsksmart/rsk-contract-metadata/images/bobcb.png')
    case 'IDRCB':
      return require('@rsksmart/rsk-contract-metadata/images/idrcb.png')
    case 'UYUCB':
      return require('@rsksmart/rsk-contract-metadata/images/uyucb.png')
    case 'BTCCB':
      return require('@rsksmart/rsk-contract-metadata/images/btccb.png')
    case 'ETHCB':
      return require('@rsksmart/rsk-contract-metadata/images/ethcb.png')
    case 'BRZ':
      return require('@rsksmart/rsk-contract-metadata/images/brz.png')
    case 'XUSD':
      return require('@rsksmart/rsk-contract-metadata/images/xusd.png')
    case 'FISH':
      return require('@rsksmart/rsk-contract-metadata/images/fish.png')
    default:
      return undefined
  }
}
