import React, { useContext } from 'react'
import Button from '../../components/button'
import { KeyManagementContext } from '../../Context'

const KeysActionItem = ({ navigation }: { navigation: any }) => !useContext(KeyManagementContext).hasKeys ? <Button
  onPress={() => navigation.navigate('CreateWalletStack', { screen: 'CreateWallet' })}
  title="Create master key"
/> : <Button
  onPress={() => navigation.navigate('CreateWalletStack', { screen: 'RevealMasterKey' })}
  title="Reveal master key"
/>

export default KeysActionItem
