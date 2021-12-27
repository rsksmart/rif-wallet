import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Arrow } from '../../components/icons'
import {
  IRegisteredDappsGroup,
  IRIFWalletServicesFetcher,
} from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { grid } from '../../styles/grid'
import { ScreenWithWallet } from '../types'

interface Interface {
  visible: boolean
  setPanelActive: () => void
  navigation: any
  fetcher: IRIFWalletServicesFetcher
}

const InjectedBrowserComponent: React.FC<Interface & ScreenWithWallet> = ({
  visible,
  setPanelActive,
  navigation,
  wallet,
  fetcher,
}) => {
  const [dappsGroups, setDappsGroups] = useState<
    IRegisteredDappsGroup[] | null
  >(null)

  const [chainId, setChainId] = useState<number>(0)

  useEffect(() => {
    const action = async () => {
      const groupsResult = await fetcher.fetchDapps()
      const chainIdResult = await wallet.provider?.getNetwork()

      setDappsGroups(groupsResult)
      setChainId(chainIdResult?.chainId ?? 0)
    }

    action()
  }, [fetcher])

  console.log(
    'dappsGroups',
    dappsGroups?.flatMap(x => x.dapps),
  )

  const dapps = dappsGroups
    ?.flatMap(x => x.dapps)
    .filter(
      x =>
        x.allowedNetworks.length === 0 || x.allowedNetworks.includes(chainId),
    )

  return (
    <ScrollView style={visible ? styles.portfolioOpened : styles.portfolio}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>Explore Dapps</Text>
      </TouchableOpacity>
      {visible && (
        <>
          {dapps?.map(x => (
            <DappButton navigation={navigation} title={x.title} url={x.url} />
          ))}
        </>
      )}
    </ScrollView>
  )
}

const DappButton: React.FC<{ title: string; url: string; navigation: any }> = ({
  title,
  url,
  navigation,
}) => {
  return (
    <View>
      <TouchableOpacity
        style={{ ...grid.row, ...styles.browseRow }}
        onPress={() =>
          navigation.navigate('InjectedBrowserUX', {
            screen: 'InjectedBrowser',
            params: {
              uri: url,
            },
          })
        }>
        <View style={grid.column}>
          <Text style={styles.text}>{title}</Text>
        </View>
        <View style={grid.column}>
          <Arrow color="#66777E" rotate={90} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 15,
    fontSize: 16,
    color: '#66777E',
  },
  portfolio: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    borderRadius: 25,
    borderColor: '#e1e1e1',
    borderTopWidth: 1,
  },
  portfolioOpened: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    borderRadius: 25,
    borderColor: '#e1e1e1',
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  moreButton: {
    borderWidth: 0,
    textAlign: 'right',
  },
  //
  browseRow: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
  },
  text: {
    color: '#66777E',
  },
})

export default InjectedBrowserComponent
