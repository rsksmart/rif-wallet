import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import { ScreenProps } from '../createKeys/types'
import EntryScriptWeb3 from './EntryScriptWeb3'

export const InjectedBrowser: React.FC<
  ScreenProps<'InjectedBrowser'> & ScreenWithWallet
> = ({ wallet }) => {
  const webviewRef = useRef(null)

  const [injectedJavaScript, setInjectedJavaScript] = useState<string | null>(
    null,
  )

  const onPostMessage = ({ nativeEvent }: any) => {
    let data = nativeEvent.data

    data = typeof data === 'string' ? JSON.parse(data) : data
    if (!data || (!data.type && !data.name)) {
      return
    }

    console.log('here we are 1', data)
  }

  const onError = ({ nativeEvent }: any) => {
    console.error('onError', nativeEvent)
  }

  useEffect(() => {
    const getEntryScriptWeb3 = async () => {
      const entryScriptWeb3 = await EntryScriptWeb3.get()
      setInjectedJavaScript(entryScriptWeb3)
    }

    getEntryScriptWeb3()
  }, [])

  const onLoadStart = async ({ nativeEvent }: any) => {
    console.log('onLoadStart')

    const origin = new URL(nativeEvent.url).origin
  }

  console.log('injectedJavaScript', injectedJavaScript?.length)

  return (
    <>
      {!injectedJavaScript && <Paragraph>Loading...</Paragraph>}
      {injectedJavaScript && (
        <WebView
          decelerationRate={'normal'}
          ref={webviewRef}
          source={{ uri: 'https://basic-sample.rlogin.identity.rifos.org/' }}
          onMessage={onPostMessage}
          onError={onError}
          onLoadStart={onLoadStart}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
          userAgent={USER_AGENT}
          sendCookies
          javascriptEnabled
          allowsInlineMediaPlayback
          useWebkit
        />
      )}
    </>
  )
}

const USER_AGENT =
  Platform.OS === 'android'
    ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1'
