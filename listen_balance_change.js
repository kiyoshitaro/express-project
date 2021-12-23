const { ApiPromise, WsProvider } = require('@polkadot/api');
(async () => {

    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider })
    let BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(BOB);

    console.log(`${BOB} has a balance of ${previousFree}, nonce ${previousNonce}`);
    console.log(`You may leave this example running and start example 06 or transfer any value to ${BOB}`);

    // Here we subscribe to any balance changes and update the on-screen value
    api.query.system.account(BOB, ({ data: { free: currentFree }, nonce: currentNonce }) => {
        // Calculate the delta
        const change = currentFree.sub(previousFree);
        // Only display positive value changes (Since we are pulling `previous` above already,
        // the initial balance change will also be zero)
        if (!change.isZero()) {
            console.log(`New balance change of ${change}, nonce ${currentNonce}`);
            previousFree = currentFree;
            previousNonce = currentNonce;
        }
    });
})()