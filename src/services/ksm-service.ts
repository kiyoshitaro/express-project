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
export const calculatePartialFees = async (fromAddress, toAddress, transactionLength) => {
    try {
      const result = await api.tx.balances.transfer(toAddress, transactionLength).paymentInfo(fromAddress);
      const {partialFees} = result;
      return partialFees;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error in calculatePartialFees', error);
      return 0;
    }
  };

export const getAllFees = async transactionLength => {
    const allFees = await api.derive.balances.fees();
    const {transactionBaseFee, transferFee,creationFee} = allFees;
    const bytesFee = allFees.transactionByteFee * transactionLength
    // const transactionBaseFee = new BN(allFees.transactionBaseFee);
    // const transferFee = new BN(allFees.transferFee);
    // const bytesFee = new BN(allFees.transactionByteFee).mul(new BN(transactionLength));
    // const creationFee = new BN(allFees.creationFee);
    return {
      transactionBaseFee,
      transferFee,
      bytesFee,
      creationFee,
    };
  };
  export const checkCreationFee = async (toAddress, creationFee) => {
    try {
      const api = getApi();
      const { free } = await api.query.balances.account(toAddress);
      return free.isZero() ? creationFee : 0;
    } catch (err) {
      console.log('Error in checkCreationFee', err);
      return 0;
    }
  };
export const transferFees = async (fromAddress, toAddress, transactionLength) => {
    // get all fees
    const {
      transactionBaseFee, transferFee, bytesFee, creationFee
    } = await getAllFees(
      transactionLength,
    );

    // calculate partial fees
    const partialFees = await calculatePartialFees(fromAddress, toAddress, transactionLength);

    // check for creation fees
    const newCreationFee = await checkCreationFee(toAddress, creationFee);

    // total of all fees
    const totalFee = transactionBaseFee
      .add(transferFee)
      .add(bytesFee)
      .add(newCreationFee)
      .add(partialFees);

    // return fees object
    const fees = {
      transactionBaseFee: transactionBaseFee.toString(),
      transferFee: transferFee.toString(),
      bytesFee: bytesFee.toString(),
      creationFee: newCreationFee.toString(),
      totalFee: totalFee.toString(),
    };
    return fees;
  };

export const getApi = () => api;
