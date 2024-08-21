import {
    UpdateSpaceMetadataMessage,
    SpaceUser,
    PublicEvent,
    PrivateEvent,
    AddSpaceUserPusherToFrontMessage,
    RemoveSpaceUserPusherToFrontMessage,
    UpdateSpaceUserPusherToFrontMessage,
} from "@workadventure/messages";
import { Subject } from "rxjs";
import { describe, expect, it, vi, assert } from "vitest";
import { get } from "svelte/store";
import { SpaceRegistry } from "../SpaceRegistry/SpaceRegistry";
import { RoomConnection } from "../../Connection/RoomConnection";
import { SpaceUserExtended } from "../SpaceFilter/SpaceFilter";

/* eslint @typescript-eslint/unbound-method: 0 */

class MockRoomConnection {
    public addSpaceUserMessageStream = new Subject<AddSpaceUserPusherToFrontMessage>();
    public updateSpaceUserMessageStream = new Subject<UpdateSpaceUserPusherToFrontMessage>();
    public removeSpaceUserMessageStream = new Subject<RemoveSpaceUserPusherToFrontMessage>();
    public updateSpaceMetadataMessageStream = new Subject<UpdateSpaceMetadataMessage>();
    public emitUserJoinSpace = vi.fn();
    public emitAddSpaceFilter = vi.fn();
    public emitRemoveSpaceFilter = vi.fn();
    public emitJoinSpace = vi.fn();
    public emitLeaveSpace = vi.fn();
    public spacePublicMessageEvent = new Subject<PublicEvent>();
    public spacePrivateMessageEvent = new Subject<PrivateEvent>();
    // Add any other methods or properties that need to be mocked
}

vi.mock("../../Phaser/Entity/CharacterLayerManager", () => {
    return {
        CharacterLayerManager: {
            wokaBase64(): Promise<string> {
                return Promise.resolve("");
            },
        },
    };
});

const flushPromises = () => new Promise(setImmediate);

describe("", () => {
    it("should emit event when you create space and spaceFilter", () => {
        const roomConnection = new MockRoomConnection() as unknown as RoomConnection;
        const spaceRegistry = new SpaceRegistry(roomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);

        expect(roomConnection.emitJoinSpace).toHaveBeenCalledOnce();

        const filter = space.watchAllUsers();

        const unsubscribeUserStore = filter.usersStore.subscribe(() => {});

        expect(roomConnection.emitAddSpaceFilter).toHaveBeenCalledOnce();

        const observeUserLeft = filter.observeUserJoined.subscribe(() => {});

        expect(roomConnection.emitAddSpaceFilter).toHaveBeenCalledOnce();

        unsubscribeUserStore();

        expect(roomConnection.emitRemoveSpaceFilter).not.toHaveBeenCalled();
        observeUserLeft.unsubscribe();
        expect(roomConnection.emitRemoveSpaceFilter).toHaveBeenCalledOnce();
    });

    it("should add user inSpaceFilter._users when receive AddSpaceUserMessage", async () => {
        const roomConnection = new MockRoomConnection();
        const spaceRegistry = new SpaceRegistry(roomConnection as unknown as RoomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);
        const spaceFilter = space.watchAllUsers();

        const userFromMessage = {
            id: 1,
            name: "",
            playUri: "",
            color: "",
            characterTextures: [],
            isLogged: false,
            availabilityStatus: 0,
            roomName: undefined,
            visitCardUrl: undefined,
            tags: [],
            cameraState: false,
            microphoneState: false,
            screenSharingState: false,
            megaphoneState: false,
            jitsiParticipantId: undefined,
            uuid: "",
            chatID: undefined,
        };

        const addSpaceUserMessage: AddSpaceUserPusherToFrontMessage = {
            spaceName,
            filterName: spaceFilter.getName(),
            user: userFromMessage,
        };

        let users: Map<number, SpaceUserExtended> = new Map();
        const unsubscribe = spaceFilter.usersStore.subscribe((newUsers) => {
            users = newUsers;
        });

        roomConnection.addSpaceUserMessageStream.next(addSpaceUserMessage);

        await flushPromises();

        const userToCompare = users.get(userFromMessage.id);

        expect(userToCompare).toBeDefined();

        unsubscribe();
    });

    it("should define reactive property after... ", async () => {
        const roomConnection = new MockRoomConnection();
        const spaceRegistry = new SpaceRegistry(roomConnection as unknown as RoomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);
        const spaceFilter = space.watchAllUsers();

        const userFromMessage = {
            id: 1,
            name: "",
            playUri: "",
            color: "",
            characterTextures: [],
            isLogged: false,
            availabilityStatus: 0,
            roomName: undefined,
            visitCardUrl: undefined,
            tags: [],
            cameraState: false,
            microphoneState: false,
            screenSharingState: false,
            megaphoneState: false,
            jitsiParticipantId: undefined,
            uuid: "",
            chatID: "chat@id.fr",
        };

        const addSpaceUserMessage: AddSpaceUserPusherToFrontMessage = {
            spaceName,
            filterName: spaceFilter.getName(),
            user: userFromMessage,
        };

        roomConnection.addSpaceUserMessageStream.next(addSpaceUserMessage);

        await flushPromises();

        const userToCompare = get(spaceFilter.usersStore).get(userFromMessage.id);

        if (!userToCompare) assert.fail("user not found in store");

        expect(get(userToCompare.reactiveUser.chatID)).toBe("chat@id.fr");
    });

    it("... ", async () => {
        const roomConnection = new MockRoomConnection();
        const spaceRegistry = new SpaceRegistry(roomConnection as unknown as RoomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);
        const spaceFilter = space.watchAllUsers();

        const userFromMessage = {
            id: 1,
            name: "",
            playUri: "",
            color: "",
            characterTextures: [],
            isLogged: false,
            availabilityStatus: 0,
            roomName: undefined,
            visitCardUrl: undefined,
            tags: [],
            cameraState: false,
            microphoneState: false,
            screenSharingState: false,
            megaphoneState: false,
            jitsiParticipantId: undefined,
            uuid: "",
            chatID: "chat@id.fr",
        };

        const addSpaceUserMessage: AddSpaceUserPusherToFrontMessage = {
            spaceName,
            filterName: spaceFilter.getName(),
            user: userFromMessage,
        };

        roomConnection.addSpaceUserMessageStream.next(addSpaceUserMessage);

        await flushPromises();

        const spaceUserUpdate = SpaceUser.fromPartial({
            id: 1,
            chatID: "new@id.fr",
        });
        const updateSpaceUserMessage: UpdateSpaceUserPusherToFrontMessage = {
            spaceName,
            user: spaceUserUpdate,
            updateMask: ["chatID"],
            filterName: spaceFilter.getName(),
        };

        const userToCompare = get(spaceFilter.usersStore).get(userFromMessage.id);

        if (!userToCompare) assert.fail("user not found in store");

        const subscriber = vi.fn();

        const unsubscriber = userToCompare.reactiveUser.chatID.subscribe(subscriber);

        roomConnection.updateSpaceUserMessageStream.next(updateSpaceUserMessage);

        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber).toHaveBeenLastCalledWith("new@id.fr");

        unsubscriber();
    });

    it("should forward public events to the space", async () => {
        const roomConnection = new MockRoomConnection();
        const spaceRegistry = new SpaceRegistry(roomConnection as unknown as RoomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);

        const subscriber = vi.fn();

        const unsubscriber = space.observePublicEvent("spaceMessage").subscribe(subscriber);

        roomConnection.spacePublicMessageEvent.next({
            spaceName: "space1",
            senderUserId: 1,
            spaceEvent: {
                event: {
                    $case: "spaceMessage",
                    spaceMessage: {
                        message: "Hello",
                    },
                },
            },
        });

        await flushPromises();

        expect(subscriber).toHaveBeenCalledOnce();
        expect(subscriber).toHaveBeenLastCalledWith({
            spaceName: "space1",
            sender: 1,
            $case: "spaceMessage",
            spaceMessage: {
                message: "Hello",
            },
        });

        unsubscriber.unsubscribe();
    });

    it("should forward private events to the space", async () => {
        const roomConnection = new MockRoomConnection();
        const spaceRegistry = new SpaceRegistry(roomConnection as unknown as RoomConnection);

        const spaceName = "space1";

        const space = spaceRegistry.joinSpace(spaceName);

        const subscriber = vi.fn();

        const unsubscriber = space.observePrivateEvent("muteVideo").subscribe(subscriber);

        roomConnection.spacePrivateMessageEvent.next({
            spaceName: "space1",
            senderUserId: 1,
            receiverUserId: 2,
            spaceEvent: {
                event: {
                    $case: "muteVideo",
                    muteVideo: {
                        force: true,
                    },
                },
            },
        });

        await flushPromises();

        expect(subscriber).toHaveBeenCalledOnce();
        expect(subscriber).toHaveBeenLastCalledWith({
            spaceName: "space1",
            sender: 1,
            $case: "muteVideo",
            muteVideo: {
                force: true,
            },
        });

        unsubscriber.unsubscribe();
    });
});