import { AppRegistry } from 'react-native'

import App from './src/App'
import { name as appName } from './app.json'
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging();
AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => App)
