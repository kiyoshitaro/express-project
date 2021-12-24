export const DOT_DECIMAL_PLACES = 1000000000000;

import { ApiPromise, WsProvider } from '@polkadot/api';
// var { encodeAddress } = require('@polkadot/util-crypto');
// const { Keyring } = require('@polkadot/keyring');
// const { stringToU8a, u8aToHex } = require('@polkadot/util');

export const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
