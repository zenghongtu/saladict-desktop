# WebExtensions Emulator [![npm][npm]][npm-url]

Functional fake WebExtensions environment for development.

## 👉 For higher level usage check out [crimx/neutrino-webextension](https://github.com/crimx/neutrino-webextension).

## Why?

Developing UI page in Chrome Extensions or WebExtensions could be daunting:

1. Live reloading is tricky, let alone hot module replacement.
2. Framework dev-tools are unable to work because of the cross-extension policy.

## How?

We could just run source code in a normal webpage with a fake `window.browser` global variable. This can be done via [sinon-chrome](https://github.com/acvetkov/sinon-chrome) which stubs all the schema generated apis.

Simply stubing is not enough though, this project patches some of the apis to make it function properly.

Message communications between the developing page and background page needs a bit more work. This project offers a workaround by running the background patch with the background source code in an iframe.

## Instalation

Use `core.js` and `background.js` module in `dist`. You can also use `lib/core/index.js` and `lib/background/index.js` directly with webpack.

Depending on your build system, load `core` before everything else, then load `background` with your background source code in a iframe, then load everything left.

If using webpack-dev-server, make sure `inline` is disabled to make it work with iframe.

You can also add your own patch before loading your source code. PRs are welcome if you find any bug or incompletion.

[npm]: https://img.shields.io/npm/v/webextensions-emulator.svg
[npm-url]: https://npmjs.com/package/webextensions-emulator

## Usage

- `browser.runtion.sendMessage._sender` is a sinon stub which is function that accepts the message object and returns the `sender` object for event listener. You can use `callsFake` or any stub method to change the result.
