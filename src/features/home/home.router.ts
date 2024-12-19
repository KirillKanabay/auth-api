import {Router} from "../../framework/http/router";

const router = new Router();

router.get('/', async (req, res) => { res.end('Hello world') })

export default router;