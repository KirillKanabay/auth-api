import {Router} from "../../framework/http/router";

const router = new Router();

router.get('/', async (req, res) => { res.end('Hello world') })

router.get('/secret', async (req, res) => {
    res.end('Secret')
}, { authorized: true })

export default router;