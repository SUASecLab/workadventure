import CancelablePromise from "cancelable-promise";
import { SimpleCoWebsite } from "./SimpleCoWebsite";

export class AuthenticatedCoWebsite extends SimpleCoWebsite {
    protected token: string;
    constructor(url: URL, token: string,allowApi?: boolean, allowPolicy?: string, widthPercent?: number, closable?: boolean) {
        super(url, allowApi, allowPolicy, widthPercent, closable);
        this.token = token;
    }
    load(): CancelablePromise<HTMLIFrameElement> {
        this.url.searchParams.set('token', this.token);
        return super.load();
    }
}