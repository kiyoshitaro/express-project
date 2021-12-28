const DOT_DECIMAL_PLACES = 1000000000000;

const { ApiPromise, WsProvider } = require('@polkadot/api');
var { encodeAddress } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a, u8aToHex } = require('@polkadot/util');

(async () => {

    // const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const provider = new WsProvider('ws://127.0.0.1:9944')
    const api = await ApiPromise.create({ provider })

    // Note the .toNumber() here!
    // const existentialDeposit = await api.consts.balances.existentialDeposit.toNumber();
    // console.log(`Existential deposit for chain is ${existentialDeposit / DOT_DECIMAL_PLACES} KSM.`);

    // CONST
    // const const_ = await api.consts;
    // console.log(const_);

    // QUERY
    // // let addr = process.argv[2];
    const addr = "F3opxRbN5ZZRfqouvHzYyCBggZECckghnZocZM44hhXhLJm"
    let ALICE = '15SbxvcrYSQzjpWk6SpiHUyRKEZMCFVzgA7QKspvFqU5jy82';
    const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

    // const balance1 = await api.query.balances.account("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
    const { nonce, data: balance } = await api.query.system.account("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
    // console.log(balance1);
    console.log("----------------");
    console.log(`${balance.free}`);
    // console.log(balance === balance1);
    // console.log(`${addr} has ${balance / DOT_DECIMAL_PLACES} KSM ( ${balance} raw )`);



    // RPC: all API endpoints such as api.query, api.tx or api.derive just wrap RPC calls
    // // Retrieve the chain name - this should not change
    // const chain = await api.rpc.system.chain();
    // let lastHeader = await api.rpc.chain.getHeader();

    // // Subscribe to the new headers
    // const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    //     console.log(`${chain}: block #${lastHeader.number} =  hash ${lastHeader.hash}`);
    // });

    // QUERY SUBSCRIPTION: Subscribe to balance changes for the account
    // const unsub = await api.query.system.account(addr, ({ nonce, data: balance }) => {
    //     console.log(`${nonce}`);
    // });
    // const unsub = await api.query.timestamp.now((moment) => {
    //     console.log(`The last block has a timestamp of ${moment}`);
    // });


    // MULTI QUERY
    // For queries of the same type
    // const unsub = await api.query.system.account.multi([ADDR1, ADDR2], (balances) => {
    //     const [{ data: balance1 }, { data: balance2 }] = balances;
    //     console.log(`The balances are ${balance1.free} and ${balance2.free}`);
    // });

    // distinct types
    // const unsub = await api.queryMulti([
    //     api.query.timestamp.now,
    //     [api.query.system.account, ADDR]
    // ], ([now, { nonce, data: balance }]) => {
    //     console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
    // });


    // const lastHdr = await api.rpc.chain.getHeader((lastHdr) => { console.log(lastHdr.hash.toHex()) });
    // const { data: balanceNow } = await api.query.system.account.at(lastHdr.hash, "1743nDTMZisPgBCYSAgkUn1kVG7MePc9rvMEjoRNf4ipVkF");
    // const { nonce, data: balance } = await api.query.system.account(addr);
    // console.log(balance, nonce);

    // // Get general information about the node we are connected to
    // const [chain, nodeName, nodeVersion] = await Promise.all([
    //     api.rpc.system.chain(),
    //     api.rpc.system.name(),
    //     api.rpc.system.version()
    // ]);
    // console.log(
    //     `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    // );

    // // Adjust how many accounts to query at once.
    // let limit = 50;
    // let result = [];
    // let last_key = "";

    // let query = await api.query.system.account.entriesPaged({ args: [], pageSize: limit, startKey: last_key });
    // console.log(query);

    // for (const user of query) {
    //     let account_id = encodeAddress(user[0].slice(-32));
    //     let free_balance = user[1].data.free.toString();
    //     let reserved_balance = user[1].data.reserved.toString();
    //     result.push({ account_id, free_balance, reserved_balance });
    //     last_key = user[0];
    // }

    // console.log(result)


    // process.exit()
    // setTimeout(() => {
    //     unsubscribe();
    //     console.log('Unsubscribed');
    // }, 20000);

})()