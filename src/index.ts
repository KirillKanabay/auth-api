import {CompositeRouter} from "./framework/http/router";
import homeRouter from "./features/home/home.router";
import authRouter from "./features/auth/auth.router";
import {Application} from "./framework/http/application";
import {ACCOUNT_STORAGE_FILEPATH, PORT} from "./config";
import {ensureFileCreated} from "./framework/storage/utils";

const compositeRouter = new CompositeRouter();
compositeRouter.addRouter(homeRouter);
compositeRouter.addRouter(authRouter);

const app = new Application(compositeRouter);

const startApp = async () => {
    await ensureFileCreated(ACCOUNT_STORAGE_FILEPATH);
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
}

startApp();