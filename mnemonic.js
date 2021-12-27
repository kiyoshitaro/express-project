var bip39 = require('bip39') // npm i -S bip39
var crypto = require('crypto')
const { Keyring } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { u8aToHex } = require('@polkadot/util');

// what you describe as 'seed'
var randomBytes = crypto.randomBytes(16) // 128 bits is enough
var mnemonicGenerate = require('@polkadot/util-crypto');
// import { mnemonicGenerate } from '@polkadot/util-crypto';
// your 12 word phrase
// var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'))
var mnemonic = mnemonicGenerate.mnemonicGenerate();
console.log(mnemonic);

// what is accurately described as the wallet seed
// var seed = bip39.mnemonicToSeed(mnemonic) // you'll use this in #3 below
(async () => {
    const provider = new WsProvider('wss://westend-rpc.polkadot.io')
    const api = await ApiPromise.create({ provider })
    const keyring = new Keyring({ type: 'sr25519' });
    // Add an account, straight mnemonic
    const newPair = keyring.addFromUri(mnemonic);
    // const { address } = keyring.getPair(newPair.address);
    console.log(newPair.address, u8aToHex(newPair.publicKey));
})();

// // (Advanced) add an account with a derivation path (hard & soft)
// const newDeri = keyring.addFromUri(`${PHRASE}//hard-derived/soft-derived`);

// // (Advanced, development-only) add with an implied dev seed and hard derivation
// const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
