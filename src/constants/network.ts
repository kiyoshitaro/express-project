import { INetwork } from "../interfaces/INetwork";
export const KUSAMA_NETWORK: INetwork = {
    name: 'Kusama',
    networkURL: 'wss://kusama-rpc.polkadot.io/',
    networkPort: '',
    networkFullUrl: 'wss://kusama-rpc.polkadot.io/',
    transactionUrl: 'https://kusama.subscan.io/extrinsic',
    unit: 'KSM',
};
export const WESTEND_NETWORK: INetwork = {
    name: 'Westend',
    networkURL: 'wss://westend-rpc.polkadot.io',
    networkPort: '',
    networkFullUrl: 'wss://westend-rpc.polkadot.io',
    transactionUrl: 'https://westend.subscan.io/extrinsic',
    unit: 'WND',
};
export const MARKET_API = {
    marketDataApiUrl: 'https://api.coingecko.com/api/v3/coins',
};  