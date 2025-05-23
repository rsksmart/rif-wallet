import { AppRegistry } from 'react-native'
import Config from 'react-native-config'

import App from './src/App'
import { name as appName } from './app.json'
import './src/lib/i18n'


AppRegistry.registerComponent(appName, () => App)
