import { ApiPromise, WsProvider } from '@polkadot/api';
import { INetwork } from '../interfaces/INetwork';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import { BN } from 'bn.js';
// import type { Registry, } from '@polkadot/types/types';
import {
    Keyring
} from '@polkadot/keyring';
// import { formatBalance } from '@polkadot/util';
import { getUSDValue } from './market-service';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';

// import type { Signer, SignerResult } from '@polkadot/api/types';
// import type { KeyringPair } from '@polkadot/keyring/types';
// import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';
// import type { SignerPayloadRaw } from '@polkadot/types/types';
// import * as readline from 'readline';
// import { assert, isHex } from '@polkadot/util';
// import { blake2AsHex } from '@polkadot/util-crypto';
// import type { SignerOptions } from '@polkadot/api/submittable/types';

// let id = 0;
// export class RawSigner implements Signer {
//     public async signRaw({ data }: SignerPayloadRaw): Promise<SignerResult> {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });

//         return new Promise((resolve): void => {
//             const hashed = (data.length > (256 + 1) * 2)
//                 ? blake2AsHex(data)
//                 : data;
//             rl.question(`Payload: ${hashed}\nSignature> `, (_signature) => {
//                 const signature = _signature.trim();
//                 assert(isHex(signature), 'Supplied signature is not hex');
//                 resolve({ id: 1, signature });
//                 rl.close();
//             });
//         });
//     }
// }
// export default class AccountSigner implements Signer {
//     readonly #keyringPair: KeyringPair;
//     readonly #registry: Registry;

//     constructor(registry: Registry, keyringPair: KeyringPair) {
//         this.#keyringPair = keyringPair;
//         this.#registry = registry;
//     }

//     public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
//         return new Promise((resolve): void => {
//             const signed = this.#registry.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(this.#keyringPair);
//             resolve({ id: ++id, ...signed });
//         });
//     }
// }

let api: any = null;
let currency: string | any = "";
export const connectToApi = async (network: INetwork) => {
    let { networkFullUrl, name } = network;
    currency = network.currency;
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
        return { account, mnemonic };
    } catch (err) {
        throw new Error('Error in create address');
    }
}
export const getBalance = async (address: string) => {
    // formatBalance.setDefaults({ unit: 'KSM' });
    const marketInfo = await getUSDValue(currency);
    const {
        data: { free: balance },
    } = await api.query.system.account(address);
    // need to get this fraction directly from the network we are connected with and divide our amount with it.
    const amount = balance / (10 ** api.registry.chainDecimals);
    // const amount = formatBalance(balance, { forceUnit: 'ksm', withSi: true }, 15);
    return {
        address,
        balance,
        amount,
        currency,
        marketInfo,
    };
}
export const transfer = async (mnemonicFrom: string, addrTo: string, amount: number) => {
    const unit = new BN(10).pow(new BN(api.registry.chainDecimals));
    // const amountFormat = amount * (10 ** api.registry.chainDecimals);

    // const { account: fromAcc } = createAccount(mnemonicFrom);
    // const { account: toAcc } = createAccount(mnemonicTo);
    const keyring = new Keyring({ type: 'sr25519' });
    let fromAcc;
    try {
        fromAcc = keyring.addFromMnemonic(mnemonicFrom);
    }
    catch (err) {
        return { status: false, hash: 0, total: 0, description: "Wrong sender" };
    }

    const amountFormat = new BN(amount).mul(unit);
    console.log(amountFormat, amount);
    const transfer = api.tx.balances
        .transfer(addrTo, amountFormat);
    const { partialFee } = await transfer.paymentInfo(fromAcc);
    const fees = partialFee.muln(110).divn(100);
    let total = amountFormat
        .add(fees)
        .add(api.consts.balances.existentialDeposit);
    const { amount: fromAvailable } = await getBalance(fromAcc.address);
    // console.log(total.div(unit).toNumber().toFixed(10), fees.toNumber(), "lll", api.consts.balances.existentialDeposit.toNumber());
    if (total.div(unit).lte(new BN(fromAvailable))) {
        const signedTransaction = await transfer.signAndSend(fromAcc,
            async ({ events = [], status }: { events?: EventRecord[], status: ExtrinsicStatus; }) => {
                if (status.isFinalized) {
                    console.log(`Transaction included at blockHash ${status.asFinalized}`);
                    events.forEach(({ phase, event: { data, method, section } }) => {
                        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                    });
                }
            }
        )
        console.log(`Created transfer: ${transfer.hash.toHex()}`);
        return { status: true, hash: transfer.hash.toHex(), total: total.toNumber() / unit.toNumber() };

        // const options: Partial<SignerOptions> = { signer: new Signer() };
        // options.nonce = (await api.derive.balances.account(fromAcc)).accountNonce;
        // options.blockHash = api.genesisHash;
        // options.era = 0;
        // await transfer.signAsync(fromAcc, options);
        // console.log('\nSigned transaction:\n' + transfer.toJSON());
    }
    return { status: false, hash: 0, total: 0 };
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
