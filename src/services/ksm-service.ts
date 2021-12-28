export const DOT_DECIMAL_PLACES = 1000000000000;

import { ApiPromise, WsProvider } from '@polkadot/api';
import { INetwork } from '../interfaces/INetwork';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import { BN } from 'bn.js';

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
        if (api.isConnected) {
            console.log(`Connected to ${name} network`);
        }
        // api.on('disconnected', () => {
        //     disconnect();
        // });
        // await setChain(api);
        return api;
    } catch (err) {
        console.log(`Error in ${name} connection`);
    }
};
export const createAccount = (seedWords?: string) => {
    const mnemonic = seedWords && mnemonicValidate(seedWords)
        ? seedWords
        : mnemonicGenerate();
    try {
        const keyring = new Keyring();
        keyring.setSS58Format(42);
        const account = keyring.addFromMnemonic(`${mnemonic}`);
        // const { address } = keyring.getPair(account.address);
        return { account, mnemonic };
    } catch (err) {
        throw new Error('Error in create address');
    }
}
// public static async createAccountWithSeed() {

// }
export const getBalance = async (address: string) => {
    formatBalance.setDefaults({ unit: 'KSM' });
    const marketInfo = await getUSDValue('kusama');
    const {
        data: { free: balance },
    } = await api.query.system.account(address);
    // need to get this fraction directly from the network we are connected with and divide our amount with it.
    const amount = balance / (10 ** api.registry.chainDecimals);
    // const amount = formatBalance(balance, { forceUnit: 'ksm', withSi: true }, 15);
    return {
        address,
        balance: balance.toString(),
        amount,
        marketInfo,
    };
}
export const transfer = async (addrFrom: string, addrTo: string, amount: string) => {
    const unit = new BN(10).pow(new BN(api.registry.chainDecimals));
    const amountFormat = new BN(amount).mul(unit);
    // const amountFormat = amount * (10 ** api.registry.chainDecimals);

    // const { account: fromAcc } = createAccount(mnemonicFrom);
    // const { account: toAcc } = createAccount(mnemonicTo);
    const keyring = new Keyring({ type: 'sr25519' });
    const fromAcc = keyring.addFromAddress(addrFrom);

    const transfer = api.tx.balances
        .transfer(addrTo, amountFormat);
    const { partialFee } = await transfer.paymentInfo(fromAcc);
    const fees = partialFee.muln(110).divn(100);
    const total = amountFormat
        .add(fees)
        .add(api.consts.balances.existentialDeposit).div(unit);
    const { amount: fromAvailable } = await getBalance(fromAcc.address);
    console.log(total.toString(), fromAvailable, "lll", total.lte(new BN(fromAvailable)));

    if (total.lte(new BN(fromAvailable))) {
        console.log(fromAcc.address, "pppp");
        const signedTransaction = await transfer.signAndSend(fromAcc,
            // async ({ events = [], status }) => {
            //     // if (status?.isFinalized) {
            //     // console.log(`Transaction included at blockHash ${status.asFinalized}`);
            //     events.forEach(({ phase, event: { data, method, section } }) => {
            //         console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
            //     });
            //     // }
            // }
        )
        console.log(`Created transfer: ${signedTransaction}`);

        const txnHash = signedTransaction.hash.toHex();
        return { hash: txnHash, total: total.toString() };
    }
    return { hash: 0, total: 0 };
}

// export const calculatePartialFees = async (fromAddress, toAddress, transactionLength) => {
//     try {
//       const result = await api.tx.balances.transfer(toAddress, transactionLength).paymentInfo(fromAddress);
//       const {partialFees} = result;
//       return partialFees;
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.log('Error in calculatePartialFees', error);
//       return 0;
//     }
//   };

// export const getAllFees = async transactionLength => {
//     const allFees = await api.derive.balances.fees();
//     const {transactionBaseFee, transferFee,creationFee} = allFees;
//     const bytesFee = allFees.transactionByteFee * transactionLength
//     // const transactionBaseFee = new BN(allFees.transactionBaseFee);
//     // const transferFee = new BN(allFees.transferFee);
//     // const bytesFee = new BN(allFees.transactionByteFee).mul(new BN(transactionLength));
//     // const creationFee = new BN(allFees.creationFee);
//     return {
//       transactionBaseFee,
//       transferFee,
//       bytesFee,
//       creationFee,
//     };
//   };
//   export const checkCreationFee = async (toAddress, creationFee) => {
//     try {
//       const api = getApi();
//       const { free } = await api.query.balances.account(toAddress);
//       return free.isZero() ? creationFee : 0;
//     } catch (err) {
//       console.log('Error in checkCreationFee', err);
//       return 0;
//     }
//   };
// export const transferFees = async (fromAddress, toAddress, transactionLength) => {
//     // get all fees
//     const {
//       transactionBaseFee, transferFee, bytesFee, creationFee
//     } = await getAllFees(
//       transactionLength,
//     );

//     // calculate partial fees
//     const partialFees = await calculatePartialFees(fromAddress, toAddress, transactionLength);

//     // check for creation fees
//     const newCreationFee = await checkCreationFee(toAddress, creationFee);

//     // total of all fees
//     const totalFee = transactionBaseFee
//       .add(transferFee)
//       .add(bytesFee)
//       .add(newCreationFee)
//       .add(partialFees);

//     // return fees object
//     const fees = {
//       transactionBaseFee: transactionBaseFee.toString(),
//       transferFee: transferFee.toString(),
//       bytesFee: bytesFee.toString(),
//       creationFee: newCreationFee.toString(),
//       totalFee: totalFee.toString(),
//     };
//     return fees;
//   };

export const getApi = () => api;
