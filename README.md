<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>sWallet</code></h3>
<p align="middle">
  Smart Wallet for RSK.
</p>
<p align="middle">
  <a href="https://github.com/rsksmart/swallet/actions/workflows/ci.yml">
    <img src="https://github.com/rsksmart/swallet/actions/workflows/ci.yml/badge.svg" alt="npm" />
  </a>
  <a href="https://lgtm.com/projects/g/rsksmart/swallet/alerts/">
    <img src="https://img.shields.io/lgtm/alerts/github/rsksmart/swallet" alt="Alerts">
  </a>
  <a href="https://lgtm.com/projects/g/rsksmart/swallet/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/swallet" alt="Code Quality">
  </a>
</p>

## Install and setup

- [Setup your enviornment using the official instructions](https://reactnative.dev/docs/environment-setup)
- Install the dependecies using yarn. This will also run the postinstall script that shims the missing packages: `yarn`
- Run the app:
  - `yarn ios`
  - `yarn android`

### Run with local services

See [`@rsksmart/rif-wallet-services`](https://github.com/rsksmart/rif-wallet-services) to run RIF Wallet Services. You can then use

```
yarn ios:local
yarn android:local
```

You can build your own configuration and run

```
ENVFILE=.env.custom react-native run-ios
```

## Folder Structure

This is an ongoing process that will be documented when more are added. Below is a list of the current directories and what is expected inside.

- **src/components** - resuable components used throughout the app. These will include buttons, typography, text inputs. These are independent of the screens.
- **src/lib** - interaction with libraries used, or new libraries being created. 
- **src/state** - all things state. Right now, we are using useState, but this may be expanded to use Redux in the near future.
