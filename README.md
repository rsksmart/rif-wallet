<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
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
- **Log on to Github Packages**
  - This is a temporary step until the libraries are published to NPM
  - [Create a Github access token](https://github.com/settings/tokens) with `read:packages` permissions.
  - Log on to Github packages with: `npm login --scope=@owner --registry=https://npm.pkg.github.com` where _owner_ is your Github username. When asked for a password, use the access token.
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

```
cd android
./gradlew clean
./gradlew app:assembleRelease
```

## Folder Structure

This is an ongoing process that will be documented when more are added. Below is a list of the current directories and what is expected inside.

- **src/components** - resuable components used throughout the app. These will include buttons, typography, text inputs. These are independent of the screens.
- **src/lib** - interaction with libraries used, or new libraries being created. 
- **src/state** - all things state. Right now, we are using useState, but this may be expanded to use Redux in the near future.
