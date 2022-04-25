import CancelablePromise from "cancelable-promise";
import { SimpleCoWebsite } from "./SimpleCoWebsite";

export class NoVNCCoWebsite extends SimpleCoWebsite {
    protected password: string;
    constructor(url: URL, password: string,allowApi?: boolean, allowPolicy?: string, widthPercent?: number, closable?: boolean) {
        super(url, allowApi, allowPolicy, widthPercent, closable);
        this.password = password;
    }
    load(): CancelablePromise<HTMLIFrameElement> {
        this.url.searchParams.set('password', this.password);
        return super.load();
    }
}