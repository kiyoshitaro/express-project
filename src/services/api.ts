export const DOT_DECIMAL_PLACES = 1000000000000;

import { ApiPromise, WsProvider } from '@polkadot/api';
import { INetwork } from '../interfaces/INetwork';
// var { encodeAddress } = require('@polkadot/util-crypto');
// const { Keyring } = require('@polkadot/keyring');
// const { stringToU8a, u8aToHex } = require('@polkadot/util');

let api: any = null;
export const connectToApi = async (network: INetwork) => {
    let { networkFullUrl, name } = network;
    try {
        const provider = new WsProvider(networkFullUrl);
        api = await ApiPromise.create({ provider });
        console.log(`Connected to ${name} network`);
        // api.on('disconnected', () => {
        //     disconnect();
        // });
        // await setChain(api);
        return api;
    } catch (err) {
        console.log('Error in polkadot connection');
    }
};
export const getApi = () => api;
