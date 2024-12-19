declare module "http" {
    interface IncomingMessage {
        params?: Record<string, string>;
        rawBody: string;
    }
}