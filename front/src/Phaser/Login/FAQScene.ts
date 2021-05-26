import {gameManager} from "../Game/GameManager";
import {ResizableScene} from "./ResizableScene";
import {LoginSceneName} from "./LoginScene";

import {faqSceneVisibleStore} from "../../Stores/FAQSceneStore";

export const FAQSceneName = "FAQScene";

export class FAQScene extends ResizableScene {

    constructor() {
        super({
            key: FAQSceneName
        });
    }

    preload() {}

    create() {
        faqSceneVisibleStore.set(true);
    }

    public onResize(): void {
    }

    update(time: number, delta: number): void {
    }

    public start(): void {
        gameManager.setShownFaq(true);

        this.scene.stop(FAQSceneName);
        gameManager.tryResumingGame(LoginSceneName);
        this.scene.remove(FAQSceneName);

        faqSceneVisibleStore.set(false);
    }
}
