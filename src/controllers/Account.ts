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
        const { seedWords } = req.body;
        try {
            const { account, mnemonic } = Wallet.createAccount(seedWords);
            res.status(201).json({ status: true, data: { address: account.address, seedWords: mnemonic } })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    }
    public static async Transfer(req: IRequest, res: IResponse): Promise<any> {
        let { mnemonicFrom, addrTo, amount } = req.body;
        try {
            amount = Number(amount);
            const { status, hash, total } = await Wallet.transfer(mnemonicFrom, addrTo, amount);
            res.status(201).json({ status, data: { hash, total } })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    }
}

export default Account;
