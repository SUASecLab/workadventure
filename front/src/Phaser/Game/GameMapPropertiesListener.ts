import type { GameScene } from "./GameScene";
import type { GameMap } from "./GameMap";
import { scriptUtils } from "../../Api/ScriptUtils";
import { coWebsiteManager } from "../../WebRtc/CoWebsiteManager";
import { layoutManagerActionStore } from "../../Stores/LayoutManagerStore";
import {
    ON_ACTION_TRIGGER_BUTTON,
    TRIGGER_WEBSITE_PROPERTIES,
    WEBSITE_MESSAGE_PROPERTIES,
    TRIGGER_BBB_PROPERTIES,
    BBB_MESSAGE_PROPERTIES,
} from "../../WebRtc/LayoutManager";
import type { RoomConnection } from "../../Connexion/RoomConnection";

export class GameMapPropertiesListener {
    constructor(private scene: GameScene, private gameMap: GameMap, private connection: RoomConnection | undefined, private playerName: string) {}

    register() {
        this.gameMap.onPropertyChange("openTab", (newValue, oldvalue, allProps) => {
            if (newValue === undefined) {
                layoutManagerActionStore.removeAction("openTab");
            }
            if (typeof newValue == "string" && newValue.length) {
                const openWebsiteTriggerValue = allProps.get(TRIGGER_WEBSITE_PROPERTIES);
                if (openWebsiteTriggerValue && openWebsiteTriggerValue === ON_ACTION_TRIGGER_BUTTON) {
                    let message = allProps.get(WEBSITE_MESSAGE_PROPERTIES);
                    if (message === undefined) {
                        message = "Press SPACE or touch here to open web site in new tab";
                    }
                    layoutManagerActionStore.addAction({
                        uuid: "openTab",
                        type: "message",
                        message: message,
                        callback: () => scriptUtils.openTab(newValue),
                        userInputManager: this.scene.userInputManager,
                    });
                } else {
                    scriptUtils.openTab(newValue);
                }
            }
        });
        this.gameMap.onPropertyChange("openWebsite", (newValue, oldValue, allProps) => {
            if (newValue === undefined) {
                layoutManagerActionStore.removeAction("openWebsite");
                coWebsiteManager.closeCoWebsite();
            } else {
                const openWebsiteFunction = () => {
                    const authenticate = allProps.get("authenticate") as boolean | undefined;
                    if (authenticate) {
                        this.connection?.emitQueryCowebsiteAuthenticationJwtMessage(
                            this.playerName,
                            newValue as string,
                            this.scene.MapUrlFile,
                            allProps.get("openWebsiteAllowApi") as boolean | undefined,
                            allProps.get("openWebsitePolicy") as string | undefined,
                            allProps.get("openWebsiteWidth") as number | undefined
                        );
                    } else {
                        coWebsiteManager.loadCoWebsite(
                            newValue as string,
                            this.scene.MapUrlFile,
                            allProps.get("openWebsiteAllowApi") as boolean | undefined,
                            allProps.get("openWebsitePolicy") as string | undefined,
                            allProps.get("openWebsiteWidth") as number | undefined
                        );
                    }
                    layoutManagerActionStore.removeAction("openWebsite");
                };
                const openWebsiteTriggerValue = allProps.get(TRIGGER_WEBSITE_PROPERTIES);
                if (openWebsiteTriggerValue && openWebsiteTriggerValue === ON_ACTION_TRIGGER_BUTTON) {
                    let message = allProps.get(WEBSITE_MESSAGE_PROPERTIES);
                    if (message === undefined) {
                        message = "Press SPACE or touch here to open web site";
                    }
                    layoutManagerActionStore.addAction({
                        uuid: "openWebsite",
                        type: "message",
                        message: message,
                        callback: () => openWebsiteFunction(),
                        userInputManager: this.scene.userInputManager,
                    });
                } else {
                    openWebsiteFunction();
                }
            }
        });
        this.gameMap.onPropertyChange("bbbRoom", (newValue, oldValue, allProps) => {
            if (newValue === undefined) {
                layoutManagerActionStore.removeAction("bbb");
                coWebsiteManager.closeCoWebsite();
            } else {
                const startBBBFunction = () => {
                    const meetingName = allProps.get("bbbRoom") as string | undefined;
                    this.connection?.emitStartBBBMessage(this.playerName, meetingName);
                    layoutManagerActionStore.removeAction("bbb");
                }

                const bbbTriggerValue = allProps.get(TRIGGER_BBB_PROPERTIES);
                if (bbbTriggerValue && bbbTriggerValue === ON_ACTION_TRIGGER_BUTTON) {
                    let message = allProps.get(BBB_MESSAGE_PROPERTIES);
                    if (message === undefined) {
                        message = "Press SPACE or touch here to enter BBB meeting room";
                    }
                    layoutManagerActionStore.addAction({
                        uuid: "bbb",
                        type: "message",
                        message: message,
                        callback: () => startBBBFunction(),
                        userInputManager: this.scene.userInputManager,
                    });
                } else {
                    startBBBFunction();
                }
            }
        });
    }
}
