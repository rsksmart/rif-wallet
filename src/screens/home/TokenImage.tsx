import {
  ColorValue,
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'

import { ChainID } from 'lib/eoaWallet'

import { FrownFaceIcon } from 'components/icons'
import { sharedColors } from 'shared/constants'
interface Props {
  symbol: string
  white?: boolean
  transparent?: boolean
  color?: ColorValue | string
  size?: number
}

export const TokenImage = ({
  symbol,
  size = 18,
  transparent = false,
  color = sharedColors.black,
  white,
}: Props) => {
  let finalSymbol = symbol

  if (white) {
    finalSymbol = finalSymbol + 'white'
  }

  const viewStyle: StyleProp<ViewStyle> = {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const iconStyle: StyleProp<ImageStyle> = { height: size, width: size }

  const imageSource = transparent
    ? getTransparentIconSource(finalSymbol) || getIconSource(finalSymbol)
    : getIconSource(finalSymbol)
  return (
    <View style={viewStyle}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={[iconStyle, transparent ? { backgroundColor: color } : null]}
          resizeMode="contain"
        />
      ) : (
        <FrownFaceIcon height={size} width={size} />
      )}
    </View>
  )
}

export enum TokenSymbol {
  USD = 'USD',
  TRBTC = 'TRBTC',
  RIF = 'RIF',
  TRIF = 'tRIF',
  DOC = 'DOC',
  RDOC = 'RDOC',
  USDRIF = 'USDRIF',
  RIFP = 'RIFP',
  BPRO = 'BPRO',
  RNS = 'RNS',
  TRNS = 'TRNS',
  INV = 'INV',
  RDAI = 'RDAI',
  RKOVDAI = 'RKOVDAI',
  WRBTC = 'WRBTC',
  RBTC_RIF = '🦄RBTC:RIF',
  RBTC_TRIF = '🦄RBTC:TRIF',
  RIF_DOC = '🦄RIF:DOC',
  TRIF_DOC = '🦄TRIF:DOC',
  BPRO_DOC = '🦄BPRO:DOC',
  RDOC_DOC = '🦄RDOC:DOC',
  DAI_DOC = '🦄DAI:DOC',
  RDAI_RBTC = '🦄RDAI:RBTC',
  RIF_RDAI = '🦄RIF:RDAI',
  RFLIXX = 'RFLIXX',
  RLINK = 'RLINK',
  RKOVLINK = 'RKOVLINK',
  RUSDC = 'RUSDC',
  RKOVUSDC = 'RKOVUSDC',
  RUSDT = 'RUSDT',
  RKOVUSDT = 'RKOVUSDT',
  RRFOX = 'RRFOX',
  CRUSDT = 'CRUSDT',
  CRIF = 'CRIF',
  CRBTC = 'CRBTC',
  RBUND = 'RBUND',
  RKOVBUND = 'RKOVBUND',
  RAMLT = 'RAMLT',
  SOV = 'SOV',
  MOC = 'MOC',
  RUBI = 'RUBI',
  RKOVUBI = 'RKOVUBI',
  ARSCB = 'ARSCB',
  USDCB = 'USDCB',
  VESCB = 'VESCB',
  COPCB = 'COPCB',
  BRLCB = 'BRLCB',
  EURCB = 'EURCB',
  PABCB = 'PABCB',
  PYGCB = 'PYGCB',
  PENCB = 'PENCB',
  CNYCB = 'CNYCB',
  MXNCB = 'MXNCB',
  BOBCB = 'BOBCB',
  IDRCB = 'IDRCB',
  UYUCB = 'UYUCB',
  BTCCB = 'BTCCB',
  BTCT = 'BTCT',
  BTC = 'BTC',
  ETHCB = 'ETHCB',
  BRZ = 'BRZ',
  XUSD = 'XUSD',
  FISH = 'FISH',
  RBTC = 'RBTC',
}

export const getTransparentIconSource = (
  symbol: string | undefined,
): ImageRequireSource | undefined => {
  if (!symbol) {
    return undefined
  }
  switch (symbol.toUpperCase()) {
    case 'RBTC':
    case 'TRBTC':
      return require('../../images/rbtc-transparent.png')
    case 'RIF':
    case 'TRIF':
      return require('../../images/rif-transparent.png')
    case 'RIFWHITE':
    case 'TRIFWHITE':
      return require('../../images/rif-white.png')
    case 'RDOC':
      return require('./../../images/rdoc-transparent.png')
    case 'USDRIF':
      return require('./../../images/usdrif-transparent.png')
    case 'BTCCB':
    case 'BTCT':
    case 'BTC':
      return require('./../../images/btc-transparent.png')
    default:
      return undefined
  }
}

export const getIconSource = (
  symbol: string | undefined,
): ImageRequireSource | undefined => {
  if (!symbol) {
    return undefined
  }
  switch (symbol.toUpperCase()) {
    case 'RBTC':
    case 'TRBTC':
      return require('../../images/rbtc.png')
    case 'RIF':
    case 'TRIF':
      return require('./../../images/rif.png')
    case 'DOC':
      return require('@rsksmart/rsk-contract-metadata/images/doc.png')
    case 'RDOC':
      return require('./../../images/rdoc.png')
    case 'USDRIF':
      return require('./../../images/usdrif.png')
    case 'RIFP':
      return require('@rsksmart/rsk-contract-metadata/images/rifpro.png')
    case 'BPRO':
      return require('@rsksmart/rsk-contract-metadata/images/bpro.png')
    case 'RNS':
    case 'TRNS':
      return require('@rsksmart/rsk-contract-metadata/images/rif.png')
    case 'INV':
      return require('@rsksmart/rsk-contract-metadata/images/inv.png')
    case 'RDAI':
    case 'RKOVDAI':
      return require('@rsksmart/rsk-contract-metadata/images/dai.png')
    case 'WRBTC':
      return require('@rsksmart/rsk-contract-metadata/images/wrbtc.png')
    case '🦄RBTC:RIF':
    case '🦄RBTC:TRIF':
      return require('@rsksmart/rsk-contract-metadata/images/rif-rbtc.png')
    case '🦄RIF:DOC':
    case '🦄TRIF:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rif-doc.png')
    case '🦄BPRO:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/bpro-doc.png')
    case '🦄RDOC:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rdoc-doc.png')
    case '🦄DAI:DOC':
      return require('@rsksmart/rsk-contract-metadata/images/rdai-doc.png')
    case '🦄RDAI:RBTC':
      return require('@rsksmart/rsk-contract-metadata/images/rdai-rbtc.png')
    case '🦄RIF:RDAI':
      return require('@rsksmart/rsk-contract-metadata/images/rif-rdai.png')
    case 'RFLIXX':
      return require('@rsksmart/rsk-contract-metadata/images/flixx.png')
    case 'RLINK':
    case 'RKOVLINK':
      return require('@rsksmart/rsk-contract-metadata/images/link.png')
    case 'RUSDC':
    case 'RKOVUSDC':
      return require('@rsksmart/rsk-contract-metadata/images/usdc.png')
    case 'RUSDT':
    case 'RKOVUSDT':
      return require('@rsksmart/rsk-contract-metadata/images/usdt.png')
    case 'RRFOX':
      return require('@rsksmart/rsk-contract-metadata/images/rfox.png')
    case 'CRUSDT':
      return require('@rsksmart/rsk-contract-metadata/images/crusdt.png')
    case 'CRIF':
      return require('@rsksmart/rsk-contract-metadata/images/crif.png')
    case 'CRBTC':
      return require('@rsksmart/rsk-contract-metadata/images/crbtc.png')
    case 'RBUND':
    case 'RKOVBUND':
      return require('@rsksmart/rsk-contract-metadata/images/bund.png')
    case 'RAMLT':
      return require('@rsksmart/rsk-contract-metadata/images/amlt.png')
    case 'SOV':
      return require('@rsksmart/rsk-contract-metadata/images/sov.png')
    case 'MOC':
      return require('@rsksmart/rsk-contract-metadata/images/moc.png')
    case 'RUBI':
    case 'RKOVUBI':
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
    case 'BTCT':
    case 'BTC':
      return require('./../../images/btc.png')
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

export const getTokenSymbolByChainId = (
  symbol: string | TokenSymbol,
  chainId: ChainID,
) => {
  const upperSymbol = symbol.toUpperCase()
  const isMainnet = chainId === 30
  switch (upperSymbol) {
    case 'RIF':
    case 'TRIF':
      return isMainnet ? TokenSymbol.RIF : TokenSymbol.TRIF
    case 'RBTC':
    case 'TRBTC':
      return isMainnet ? TokenSymbol.RBTC : TokenSymbol.TRBTC
    case 'BTC':
    case 'BTCT':
      return isMainnet ? TokenSymbol.BTC : TokenSymbol.BTCT
    default:
      return TokenSymbol[upperSymbol as keyof typeof TokenSymbol] || upperSymbol
  }
}
