import { ScrollView } from 'react-native'

import { SignTypedDataArgs } from 'lib/eoaWallet'

import { Typography } from 'src/components'

import { requestStyles as styles } from './styles'

interface Props {
  payload: SignTypedDataArgs
}
export const SignTypedDataComponent = ({ payload }: Props) => {
  const [domain, , messageData] = payload
  return (
    <ScrollView>
      <Typography type={'h2'} style={styles.typographyRowStyle}>
        Domain:
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        Name: {domain.name}
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        Version: {domain.version}
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        ChainId: {domain.chainId}
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        Verifying Contract: {domain.verifyingContract}
      </Typography>

      <Typography type={'h2'} style={styles.typographyRowStyle}>
        Message:
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        From: {messageData.from.name} ({messageData.from.wallet})
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        To: {messageData.to.name} ({messageData.to.wallet})
      </Typography>

      <Typography type={'h2'} style={styles.typographyRowStyle}>
        Contents:
      </Typography>
      <Typography type="h3" style={styles.typographyRowStyle}>
        {messageData.contents}
      </Typography>
    </ScrollView>
  )
}
