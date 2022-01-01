import { INetwork } from "../interfaces/INetwork";
export const KUSAMA_NETWORK: INetwork = {
    name: 'Kusama',
    currency: 'kusama',
    networkURL: 'wss://kusama-rpc.polkadot.io/',
    networkPort: '',
    networkFullUrl: 'wss://kusama-rpc.polkadot.io/',
    transactionUrl: 'https://kusama.subscan.io/extrinsic',
    unit: 'KSM',
};
export const WESTEND_NETWORK: INetwork = {
    name: 'Westend',
    currency: 'kusama',
    networkURL: 'wss://westend-rpc.polkadot.io',
    networkPort: '',
    networkFullUrl: 'wss://westend-rpc.polkadot.io',
    transactionUrl: 'https://westend.subscan.io/extrinsic',
    unit: 'WND',
};
export const LOCAL_NETWORK: INetwork = {
    name: 'Local',
    currency: 'kusama',
    networkURL: 'ws://127.0.0.1:9944',
    networkPort: '',
    networkFullUrl: 'ws://127.0.0.1:9944',
    transactionUrl: 'https://westend.subscan.io/extrinsic',
    unit: 'MUNIT',
};
export const MARKET_API = {
    marketDataApiUrl: 'https://api.coingecko.com/api/v3/coins',
};  