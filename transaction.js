const { ApiPromise, WsProvider } = require('@polkadot/api');
var { encodeAddress } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a, u8aToHex } = require('@polkadot/util');
const DOT_DECIMAL_PLACES = 1000000000000;

(async () => {

    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider })
    const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

    // Constuct the keyring after the API (crypto has an async init)
    const keyring = new Keyring({ type: 'sr25519' });

    // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
    const alice = keyring.addFromUri('//Alice');
    // console.log(alice);
    // console.log(`Sending from address ${alice.address} with publicKey [${alice.publicKey}]`);

    // const balance = await api.query.balances.account("15SbxvcrYSQzjpWk6SpiHUyRKEZMCFVzgA7QKspvFqU5jy82");
    const { data: balance } = await api.query.system.account(alice.address);
    console.log(`${alice.address} has ${balance.free / DOT_DECIMAL_PLACES} KSM ( ${balance.free} raw )`);

    let { data: balanceBob } = await api.query.system.account(BOB);
    console.log(`${BOB} has ${balanceBob.free / DOT_DECIMAL_PLACES} KSM ( ${balanceBob.free} raw )`);

    // // Read in argument for the address
    // // Sign and send a transfer from Alice to Bob
    // const message = stringToU8a('this is our message');
    // const signature = alice.sign(message);
    // const isValid = alice.verify(message, signature);
    // console.log(`The signature ${u8aToHex(signature)}, is ${isValid ? '' : 'in'}valid`);

    // // Payment information
    const transfer = api.tx.balances.transfer(BOB, 1000000);
    const x = await transfer.paymentInfo(alice);
    console.log(`transaction will have a weight of ${x.weight / DOT_DECIMAL_PLACES} KSM, with ${x.partialFee.toHuman()} weight fees`);

    // Send
    const unsub = await transfer.signAndSend(alice,
        async ({ events = [], status }) => {
            console.log(`Current status is ${status.type}`);

            if (status.isFinalized) {
                console.log(`Transaction included at blockHash ${status.asFinalized}`);
                // Loop through Vec<EventRecord> to display all events
                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                });
                // OVERVIEWIREFRESHINTERVAL = 2000
                // interval = setInterval(async () => {
                //     let { data: balanceBob1 } = await api.query.system.account(BOB);
                //     console.log(`${BOB} has ${balanceBob1.free / DOT_DECIMAL_PLACES} KSM ( ${balanceBob1.free} raw )`);
                // }, OVERVIEWIREFRESHINTERVAL);
                // clearInterval(interval);
                unsub();
            }
        }
    );
    // Show the hash
    // console.log(`Submitted with hash ${unsub.toHex()}`);
})()