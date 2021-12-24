import path from "path";
import { IRequest, IResponse, INext } from '../interfaces';

class Home {
    public static index(req: IRequest, res: IResponse, next: INext): void {
        // if (req.session.loggedin) {
        res.status(200).sendFile(path.resolve(__dirname, '../../public/brown_cv.html'))
        // } else {
        //     res.redirect('/');
        // }
    }
}

export default Home;
