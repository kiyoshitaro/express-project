import { IRequest, IResponse, INext } from '../interfaces';

class NotFound {
    public static index(req: IRequest, res: IResponse, next: INext): void {
        res.status(404).send('<h1>Page not found</h1>')
    }
}

export default NotFound;
