import {CompositeRouter} from "./framework/http/router";
import homeRouter from "./features/home/home.router";
import {Application} from "./framework/http/application";
import {PORT} from "./config";

const compositeRouter = new CompositeRouter();
compositeRouter.addRouter(homeRouter);

const app = new Application(compositeRouter);

const startApp = async () => {
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
}

startApp();