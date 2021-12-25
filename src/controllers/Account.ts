import { IRequest, IResponse } from '../interfaces';
import * as Wallet from "../services/ksm-service";

class Account {
    public static async GetOne(req: IRequest, res: IResponse): Promise<any> {
        const address = req.params.id;
        if (address) {
            const balance = await Wallet.getBalance(address)
            res.status(200).json({
                status: true, data: balance
            });
        }
        else {
            res.status(404).json({
                status: false, data: {
                    address,
                    balance: '0',
                }
            });
        }
    }

    public static Post(req: IRequest, res: IResponse): any {
        // const { seedWords } = req.body;
        try {
            const { address, seedWords } = Wallet.createNewAccount();
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
