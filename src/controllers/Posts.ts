import { IRequest, IResponse, INext } from '../interfaces';
import posts from '../data';

class Posts {
    public static GetAll(req: IRequest, res: IResponse): any {
        res.status(200).json({ status: true, posts })
    }

    public static GetOne(req: IRequest, res: IResponse): any {
        const _post = posts.find((post: any) => post.id = req.params.id);
        if (_post) {
            res.status(200).json({ status: true, data: _post });
        }
        else {
            // logger.error('Not exist ' + post.id);
            res.status(404).json({ status: false, data: [] });
        }
    }
    public static Post(req: IRequest, res: IResponse): any {
        const { content, img } = req.body;
        if (img) {
            res.status(201).json({ status: true, data: [...posts, { content, img }] })
        }
        else {
            // logger.error('img field is empty');
            res.status(400).json({ status: false })
        }
    }
    public static Put(req: IRequest, res: IResponse): any {
        const { id, content, img, tags } = req.body;
        const _post = posts.find((post: any) => post.id = id);
        if (_post) {
            const newPosts = posts.map((post: any) => {
                if (post.id === Number(id)) {
                    post.content = content;
                    post.img = img;
                    post.tags = tags;
                }
                return post
            })
            res.status(200).json({ status: true, data: newPosts })
        }
        else {
            // logger.error('Not exist ' + post.id);
            res.status(404).json({ status: false })
        }
    }

    public static Delete(req: IRequest, res: IResponse): any {
        const _post = posts.find((post: any) => post.id === Number(req.params.id))
        if (_post) {
            const _newPosts = posts.filter(
                (post: any) => post.id !== Number(req.params.id)
            )
            res.status(200).json({ status: true, data: _newPosts })
        }
        else {
            // logger.error('Not exist ' + post.id);
            res.status(404).json({ success: false })
        }
    }

}

export default Posts;