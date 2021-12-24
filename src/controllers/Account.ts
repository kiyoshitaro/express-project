import { IRequest, IResponse, INext } from '../interfaces';
import { getApi } from '../services/api';
import {
    formatBalance,
} from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import {
    Keyring
} from '@polkadot/keyring';
class Account {
    public static async GetOne(req: IRequest, res: IResponse): Promise<any> {
        const address = req.params.id;
        try {
            const api = getApi();
            // const marketData = await getUSDValue('polkadot-iou');
            const {
                data: { free: balance },
            } = await api.query.system.account(address);
            const dotBalance = formatBalance(balance, { forceUnit: 'dot', withSi: true }, 15);
            res.status(200).json({
                status: true, data: {
                    address,
                    balance: balance.toString(),
                    amount: dotBalance.replace(' DOT', ''),
                    // marketData,
                }
            });
        } catch (err) {
            res.status(404).json({
                status: false, data: {
                    address,
                    balance: '0',
                }
            });
        }
    }
    public static createNewAccount() {
        const seedWords = mnemonicGenerate();
        try {
            const keyring = new Keyring();
            keyring.setSS58Format(42);
            const pairAlice = keyring.addFromUri(seedWords);
            const { address } = keyring.getPair(pairAlice.address);
            return { address, seedWords };
        } catch (err) {
            throw new Error('Error in Polkadot getAddress');
        }
    }
    // public static async createAccountWithSeed() {

    // }

    public static Post(req: IRequest, res: IResponse): any {
        // const { seedWords } = req.body;
        try {
            const { address, seedWords } = Account.createNewAccount();
            // const account = seedWords === undefined
            //     ? this.createNewAccount()
            //     : this.createAccountWithSeed(seedWords);
            res.status(201).json({ status: true, data: { address, seedWords } })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    }
}

export default Account;
