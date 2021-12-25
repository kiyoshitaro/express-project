export const DOT_DECIMAL_PLACES = 1000000000000;

import { ApiPromise, WsProvider } from '@polkadot/api';
import { INetwork } from '../interfaces/INetwork';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import {
    Keyring
} from '@polkadot/keyring';
import {
    formatBalance,
} from '@polkadot/util';
import { getUSDValue } from './market-service';
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
        console.log(`Error in ${name} connection`);
    }
};
export const createNewAccount = () => {
    const seedWords = mnemonicGenerate();
    try {
        const keyring = new Keyring();
        keyring.setSS58Format(42);
        const pairAlice = keyring.addFromUri(seedWords);
        const { address } = keyring.getPair(pairAlice.address);
        return { address, seedWords };
    } catch (err) {
        throw new Error('Error in create address');
    }
}
// public static async createAccountWithSeed() {

// }
export const getBalance = async (address: string) => {
    formatBalance.setDefaults({ unit: 'KSM' });
    const marketPrice = await getUSDValue('kusama');
    const {
        data: { free: balance },
    } = await api.query.system.account(address);
    const dotBalance = formatBalance(balance, { forceUnit: 'ksm', withSi: true }, 15);
    return {
        address,
        balance: balance.toString(),
        amount: dotBalance.replace(' KSM', ''),
        marketPrice,
    };
}
export const getApi = () => api;
