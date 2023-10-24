<p align="middle">
  <img src="https://user-images.githubusercontent.com/766679/236442723-004fc7a5-edb2-4477-86da-0b687d62702f.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>RIF Wallet</code></h3>
<p align="middle">
  Smart Wallet for RSK.
</p>
<p align="middle">
  <a href="https://github.com/rsksmart/swallet/actions/workflows/ci.yml">
    <img src="https://github.com/rsksmart/swallet/actions/workflows/ci.yml/badge.svg" alt="npm" />
  </a>
</p>

## Install and setup

- [Setup your enviornment using the official instructions](https://reactnative.dev/docs/environment-setup)
  - Use the 'React Native CLI Quickstart' tabs not the 'Expo' tabs.
  - Follow the instructions explicitly as a small deviation can cause it to fail.
- Install the dependecies using yarn. This will also run the postinstall script that shims the missing packages: `yarn`
  - The postinstall script runs the `rn-nodeify` package which adds packages that are native to the browser but not to react native.
  - For **iOS** you need to run the additional installation steps: `cd ios` and then `pod install`
- Run the app using the desired platform:
  - `yarn ios`
  - `yarn android`

## Troubleshooting

When you encounter errors running the app, please run `yarn clean:ios` or `yarn clean:android` first. This will clear the cache and reinstall the native dependecies. When running the iOS command, if you get the error `Could not delete [...]/build' because it was not created by the build system.` delete the build folder manually.

## Run with local services

See [`@rsksmart/rif-wallet-services`](https://github.com/rsksmart/rif-wallet-services) to run RIF Wallet Services. You can then use

```
yarn ios:local
yarn android:local
```

You can build your own configuration and run

```
ENVFILE=.env.custom react-native run-ios
```

You do not need to run the server to run the RIF Wallet app.

## MAINNET

To run with mainnet change the environment variable `DEFAULT_CHAIN_TYPE` to MAINNET [here](https://github.com/rsksmart/swallet/blob/3335ab050b0cb04b901cae42e30745dd2c6ad3f6/.env#L10)

## Build:

## Build APK for Android:

The build step for Android includes a clean. When prompted, say 'Yes' to anything related to Android and 'No' to iOS and system updates.

```
yarn android:build
```

## Folder Structure

This is an ongoing process that will be documented when more are added. Below is a list of the current directories and what is expected inside.

- **src/components** - resuable components used throughout the app. These will include buttons, typography, text inputs. These are independent of the screens.
- **src/lib** - interaction with libraries used, or new libraries being created. 
- **src/state** - all things state. Right now, we are using useState, but this may be expanded to use Redux in the near future.

## Notes on Bitcoin Addresses generation

In RIF Wallet, bitcoin addresses are automatically generated. 
The system's fetcher chooses an available index by accessing the endpoint /getNextUnusedIndex/:xpub from rif-wallet-services. 
This endpoint returns an available index that hasn't been used previously, making it suitable for address creation. 
Additionally, the endpoint provides multiple indexes, allowing the wallet to select from them for sending any remainder amounts. 
Using the Bitcoin library rif-wallet-bitcoin, the wallet generates an address based on this index. 
It also creates several additional addresses to send the remainder amount back to the owner.

Object returned by the endpoint mentioned above:

```javascript
{
  "index": 0,
  "availableIndexes": [1, 2, 3, 4, 5]
}
```

The address creation process is explained in the rif-wallet-libs, in the @rsksmart/rif-wallet-bitcoin package.

See fetchExternalAvailableAddress and fetchExternalAvailableAddresses in BIP.ts for more reference on how it works.

### Bitcoin address generation places

The bitcoin addresses are generated in two parts:

ReceiveScreen -> BIP.ts.fetchExternalAvailableAddress -> which fetches one address at a time and stores it in the state.

![ReceiveScreenDiagram](https://private-user-images.githubusercontent.com/39339295/277714009-3a9a9d6c-14e2-4066-a20c-ce31de3c2bc6.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTgxNjEwMjUsIm5iZiI6MTY5ODE2MDcyNSwicGF0aCI6Ii8zOTMzOTI5NS8yNzc3MTQwMDktM2E5YTlkNmMtMTRlMi00MDY2LWEyMGMtY2UzMWRlM2MyYmM2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEwMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMDI0VDE1MTg0NVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTM2NmRiZmI0YTVhNzI0N2NiYmU5ZWM0MDNhNmY0NDY5NTZkYmI5OWUwNjg1Y2ExYWI0MmVmYWMwZTZhMzgwZmUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.h-OGTcMv9lWpLwBtgkJwxcsUbnW8sJSqeN0iDxjTNcg)

bitcoinUtils.ts -> BIP.ts.fetchExternalAvailableAddresses ->  which is utilized in the paymentExecutor.ts 

DIAGRAM HERE