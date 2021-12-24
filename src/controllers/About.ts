import { IRequest, IResponse, INext } from '../interfaces';

class About {
    public static index(req: IRequest, res: IResponse, next: INext): void {
        res.status(200).send('About Page')
    }
}

export default About;
