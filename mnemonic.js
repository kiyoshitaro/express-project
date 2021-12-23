var bip39 = require('bip39') // npm i -S bip39
var crypto = require('crypto')
const { Keyring } = require('@polkadot/keyring');

// what you describe as 'seed'
var randomBytes = crypto.randomBytes(16) // 128 bits is enough

// your 12 word phrase
var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'))

// what is accurately described as the wallet seed
var seed = bip39.mnemonicToSeed(mnemonic) // you'll use this in #3 below
console.log(mnemonic)

const keyring = new Keyring({ type: 'sr25519' });

// Add an account, straight mnemonic
const newPair = keyring.addFromUri(PHRASE);

// (Advanced) add an account with a derivation path (hard & soft)
const newDeri = keyring.addFromUri(`${PHRASE}//hard-derived/soft-derived`);

// (Advanced, development-only) add with an implied dev seed and hard derivation
const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
