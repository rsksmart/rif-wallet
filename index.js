import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { URL, URLSearchParams } from 'whatwg-url'
import 'text-encoding-polyfill'

global.URL = URL
global.URLSearchParams = URLSearchParams

AppRegistry.registerComponent(appName, () => App)
