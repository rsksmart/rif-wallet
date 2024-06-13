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

The RIF Wallet is an account abstraction wallet built on the Rootstock network with integration to Bitcoin. Very simplistically, in an Externally Owned Account (EOA) wallet, which is what most wallets are, a user's mnemonic generates a key pair which along with a deviation path derives an address. With Account Abstraction, we take this one step further and have that account/address deploy a smart contract. The address of the smart contract becomes their account and holds their assets (tokens/NFTs/etc).

The main use case of the RIF Wallet using account abstraction is to pay the gas fees with an ERC20 token using [RIF Relay](https://dev.rootstock.io/rif/relay/). However, additional use cases can be adapted such as social recovery. 

## Install and setup

- [Setup your enviornment using the official instructions](https://reactnative.dev/docs/environment-setup)
  - Use the 'React Native CLI Quickstart' tabs not the 'Expo' tabs.
  - Follow the instructions explicitly as a small deviation can cause it to fail.
- Install the dependecies using yarn. This will also run the postinstall script that shims the missing packages: `yarn`
  - The postinstall script runs the `rn-nodeify` package which adds packages that are native to the browser but not to react native.
  - For **iOS** you need to run the additional installation steps: `cd ios` and then `pod install`
- Set the environment variable `TRACE_ID` in `.env` file to connect with backend server with an identifier, i.e. your company name.
- Run the app using the desired platform:
  - `yarn ios`
  - `yarn android`

## Troubleshooting

When you encounter errors running the app, please run `yarn clean:ios` or `yarn clean:android` first. This will clear the cache and reinstall the native dependecies. When running the iOS command, if you get the error `Could not delete [...]/build' because it was not created by the build system.` delete the build folder manually.

## Run with local services

The RIF Wallet App uses a [backend server](https://github.com/rsksmart/rif-wallet-services) to connect to the Rootstock indexer and to collect USD prices. You can run this server yourself locally and connect to it durning development. However, this is not necessary as we have an instance that you can connect to and use.

```
yarn ios:local
yarn android:local
```

You can build your own configuration and run

```
ENVFILE=.env.custom react-native run-ios
```

You do not need to run the server to run the RIF Wallet app.

## Mainnet

The app runs in both Rootstock mainnet and testnet with the default chain set to Testnet. You can configure this by changig the environment variable `DEFAULT_CHAIN_TYPE` to MAINNET [in the .env file](https://github.com/rsksmart/rif-wallet/blob/develop/.env).

## Build:

### Build APK for Android:

The build step for Android includes a clean. When prompted, say 'Yes' to anything related to Android and 'No' to iOS and system updates.

```
yarn android:build
```

### Build for iOS:

Open the project up in xCode and select the signing profiles that you wish to use. You may need to signup with appstoreconnect and setup the provisioning profile and certificates. [See Apple's documentation for more information](https://developer.apple.com/help/account/). Once the app and profiles are loaded in xCode, create an "archive" of the project by navigating to [Product/Archive]. After it has completed, you can distribute it locally or to the AppStore using the "Organizer" window.

## Archiving for iOS:

To create an archive to send to the App Store, before opening xCode, install the pod dependecies with the following command:

```
NO_FLIPPER=1 npx pod-install
```

## Interacting with the Smart Wallet

At a high level, the RIF Wallet uses the RIF Relay Server to send transactions on behalf of the user. The user creates a transaction in the app, signs it, and then passes it to the RIF Relay Server to get a cost estimation. That estimation is returned to the user, and the user signs an updated transaction with that cost and passes it to the Relay Server.

The server takes the fee as payment for the transaction and broadcasts the transaction to the network paying the gas fee. 

In the case that the the RIF Relay Server no longer exists or is not providing the service correctly, the users still have full access to their private key and funds. In the smart wallet contract there is a method called `directExecute` which allows a user to send transactions directly to the smart contract. In this scenario, the Externally Owned Account (EOA) can execute transactions directly on the smart contract while paying for the gas in rBTC. 

[We have created a sample script](https://github.com/rsksmart/rif-wallet/tree/develop/docs/recovery) that shows the basic interaction with the smart contract to allow users to use the wallet without the Relay Server.

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

![SendScreen](https://private-user-images.githubusercontent.com/39339295/277718130-d54a943b-e74f-456b-9568-7c4d17f81679.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTgxNjE4MjIsIm5iZiI6MTY5ODE2MTUyMiwicGF0aCI6Ii8zOTMzOTI5NS8yNzc3MTgxMzAtZDU0YTk0M2ItZTc0Zi00NTZiLTk1NjgtN2M0ZDE3ZjgxNjc5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEwMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMDI0VDE1MzIwMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTY4OTMyOGVmM2QwNDY0ZjY2MmVmMDAyYmY5NWFiODM5ZjQyNDVkMDBkMTc4ZjQzY2ViZjc5YmI2NTNiMTg1NDAmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.mMs5hswbIMK1HZqnvCb2tPMbDkVbHA6PBE-LfZXuKxE)
DIAGRAM HERE
