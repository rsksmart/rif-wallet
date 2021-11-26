import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import EntryScriptWeb3 from './EntryScriptWeb3'

import { rpcUrl } from '../../lib/jsonRpcProvider'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'
import { ScreenProps } from './types'

export const InjectedBrowser: React.FC<
  ScreenWithWallet & ScreenProps<'InjectedBrowser'>
> = ({ wallet, route }) => {
  const { uri } = route.params

  const adapter = useMemo(() => new WalletConnectAdapter(wallet), [wallet])

  const webviewRef = useRef<WebView | null>(null)
  const [progress, setProgress] = useState(0)

  const [injectedJavaScript, setInjectedJavaScript] = useState<string | null>(
    null,
  )

  const postMessageToWebView = (result: { id: string; result: any }) => {
    if (webviewRef && webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify(result))
    }
  }

  const onPostMessage = async ({ nativeEvent }: any) => {
    let data = nativeEvent.data

    data = typeof data === 'string' ? JSON.parse(data) : data
    if (!data) {
      return
    }

    const { id, method, params } = data

    try {
      console.log('init', id, method, params)

      const result = await adapter.handleCall(method, params)

      console.log('result', result)

      postMessageToWebView({ id, result })
    } catch (err: any) {
      console.error(err)

      postMessageToWebView({
        id,
        result: {
          error: true,
          message: err.message,
        },
      })
    }
  }

  const onError = ({ nativeEvent }: any) => {
    console.error('onError', nativeEvent)
  }

  const onLoadProgress = ({ nativeEvent }: any) => {
    setProgress(nativeEvent.progress)
  }

  useEffect(() => {
    const getEntryScriptWeb3 = async () => {
      console.log('wallet.smartWalletAddress', wallet.smartWalletAddress)

      const entryScriptWeb3 = await EntryScriptWeb3.get()
      setInjectedJavaScript(
        entryScriptWeb3 + JsCode({ address: wallet.smartWalletAddress }),
      )
    }

    getEntryScriptWeb3()
  }, [])

  console.log('injectedJavaScript', injectedJavaScript?.length)

  return (
    <View style={styles.webview}>
      <View style={styles.webview}>
        {injectedJavaScript && (
          <WebView
            decelerationRate={'normal'}
            ref={webviewRef as any}
            source={{
              uri,
            }}
            onMessage={onPostMessage}
            onError={onError}
            onLoadProgress={onLoadProgress}
            onload
            injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
            userAgent={USER_AGENT}
            sendCookies={true}
            javascriptEnabled
            allowsInlineMediaPlayback
            useWebkit
          />
        )}
      </View>
      <ProgressBar progress={progress} />
    </View>
  )
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <>
    {progress !== 1 && (
      <View style={styles.progressBarWrapper}>
        <Paragraph>Loading... {Math.floor(progress * 100)}%</Paragraph>
      </View>
    )}
  </>
)

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    zIndex: 1,
  },
  progressBarWrapper: {
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    position: 'absolute',
    zIndex: 999999,
  },
})

const USER_AGENT =
  Platform.OS === 'android'
    ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1'

const NETWORK_VERSION = 31 // RSK testnet

const JsCode = ({ address }: any) => /* javascript */ `
  (function () {
    let resolver = {};
    let rejecter = {};
    let callNumber = 0;

    const rpcUrl = '${rpcUrl}';

    // const provider = new Web3.providers.HttpProvider(rpcUrl);

    window.ethereum = {};
    window.ethereum.isRWallet = true;
    window.address = '${address}'; // TODO: why we need this?

    window.ethereum.on = (method, callback) => { if (method) {console.log(method)} }
    
    ${
      Platform.OS === 'ios' ? 'window' : 'document'
    }.addEventListener("message", function(message) {
      try {
        const passData = message.data ? JSON.parse(message.data) : message.data;
        const { id, result } = passData;
        if (result && result.error && rejecter[id]) {
          rejecter[id](new Error(result.message));
        } else if (resolver[id]) {
          resolver[id](result);
        }
      } catch(err) {
        console.log('listener message err: ', err);
      }
    })

    function communicateWithRN (payload) {
      return new Promise((resolve, reject) => {
        console.log('JSON.stringify(payload): ', JSON.stringify(payload));
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        const { id } = payload;
        resolver[id] = resolve;
        rejecter[id] = reject;
      })
    }

    // Override the sendAsync function so we can listen the web site's call and do our things
    const sendAsync = async (payload, callback) => {
      callNumber = callNumber + 1

      let err, res = '', result = '';
      const {method, params, jsonrpc, id} = payload;
      const newId = id ? id : callNumber
      console.log('payload: ', newId, payload);
      try {
        if (method === 'net_version') {
          result = '${NETWORK_VERSION}';
        } else if (method === 'eth_chainId') {
          result = Web3.utils.toHex(${NETWORK_VERSION});
        } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
          result = ['${address}'];
        } else {
          result = await communicateWithRN({
            method: method, 
            params: params, 
            jsonrpc: newId, 
            id: newId
          });
        }
        res = {id, jsonrpc, method, result};
      } catch(err) {
        err = err;
        console.log('sendAsync err: ', err);
      }
      
      console.log('res: ', res);
      if (callback) {
        callback(err, res);
      } else {
        return res || err;
      }
    }

    window.ethereum.send = sendAsync;
    window.ethereum.sendAsync = sendAsync;
    window.ethereum.request = (payload) =>
      new Promise((resolve, reject) =>
        sendAsync(payload).then(response =>
          response.result
            ? resolve(response.result)
            : reject(new Error(response.message || 'provider error'))));
  }) ();
`
