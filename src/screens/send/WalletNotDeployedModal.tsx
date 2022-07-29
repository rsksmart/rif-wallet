import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { RegularText, SemiBoldText } from '../../components'
import { colors } from '../../styles'
import PrimaryButton from '../../components/button/PrimaryButton'
import { Arrow } from '../../components/icons'

type WalletNotDeployedViewType = {
  onDeployWalletPress: () => void
}
const WalletNotDeployedView: React.FC<WalletNotDeployedViewType> = ({
  onDeployWalletPress,
}) => (
  <View style={styles.container} testID="WalletNotDeployedView">
    <Image
      source={require('../../images/undeployed_wallet.png')}
      style={styles.imageStyle}
      resizeMode="contain"
    />
    <View>
      <SemiBoldText style={styles.oopsText}>
        Oops... Your wallet has not yet been deployed.
      </SemiBoldText>
      <RegularText style={styles.regularText}>
        To be able to send funds, you need to deploy your wallet first.
      </RegularText>
      <PrimaryButton style={styles.buttonDeploy} onPress={onDeployWalletPress}>
        <View style={styles.buttonView}>
          <Arrow color={'white'} rotate={45} width={35} height={35} />
          <View>
            <RegularText style={styles.deployText}>deploy wallet</RegularText>
          </View>
        </View>
      </PrimaryButton>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 11,
    backgroundColor: colors.darkPurple3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  imageStyle: {
    width: '100%',
    height: 300,
    aspectRatio: 1,
  },
  oopsText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 60,
  },
  regularText: {
    color: 'white',
    paddingHorizontal: 55,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonDeploy: {
    backgroundColor: colors.background.bustyBlue,
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 30,
    width: 200,
    alignSelf: 'center',
  },
  deployText: {
    color: 'white',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default WalletNotDeployedView
