import {CompositeRouter} from "./framework/http/router";
import homeRouter from "./features/home/home.router";
import authRouter from "./features/auth/auth.router";
import {Application} from "./framework/http/application";
import {ACCOUNT_STORAGE_FILEPATH, BASE_URL, PORT} from "./config";
import {ensureFileCreated} from "./framework/storage/utils";
import {exceptionHandlingMiddleware} from "./framework/http/middlewares/exceptionHandling.middleware";
import {urlParserMiddleware} from "./framework/http/middlewares/urlParser.middleware";
import {routingMiddleware} from "./framework/http/middlewares/routing.middleware";
import {authenticationMiddleware} from "./framework/http/middlewares/authentication.middleware";
import {endpointExecutionMiddleware} from "./framework/http/middlewares/endpointExecution.middleware";

const compositeRouter = new CompositeRouter();
compositeRouter.addRouter(homeRouter);
compositeRouter.addRouter(authRouter);

const app = new Application();

app.use(exceptionHandlingMiddleware);
app.use(urlParserMiddleware(BASE_URL));
app.use(routingMiddleware(compositeRouter));
app.use(authenticationMiddleware);
app.use(endpointExecutionMiddleware);

const startApp = async () => {
    await ensureFileCreated(ACCOUNT_STORAGE_FILEPATH);
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
}

startApp();