interface RawPacket {
    id: number;
    data: object;
    sender: number;
    targets: number[];
}

class RawPacket {
    constructor(id: number, data: object, sender: number) {
        this.id = id;
        this.data = data;
        this.sender = sender;
    }

    public addTarget(user: User) {
        if (this.targets === undefined) {
            this.targets = [];
        }
        if (this.targets.indexOf(user.peerId) === -1) {
            this.targets.push(user.peerId)
        }
    }

    static parse(json: string): RawPacket {
        let o = JSON.parse(json);
        return <RawPacket>o;
    }
}

enum Packets {
    Welcome = 0,
    UserConnect = 1,
    UserDisconnect = 2
}

interface WelcomePacket {
    me: User;
    users: User[];
}

interface UserConnectPacket {
    peerId: number;
}

interface UserDisconnectPacket {
    peerId: number;
}

export class User {
    id: string;
    username: string;
    peerId: number;
    connected: boolean;
}

export class Realtime {
    public readonly host: string;
    public readonly port: number;
    public readonly accessToken: string;

    private ws: WebSocket;
    private connectHandler: () => void;
    private disconnectHandler: () => void;
    private receiveHandler: (packetId: number, data: object, sender: User) => void;
    private errorHandler: () => void;
    private userConnectHandler: (user: User) => void;
    private userDisconnectHandler: (user: User) => void;

    public me: User;
    public users: User[];
    public connectedUsersByPeerId: object;

    constructor(host: string, port: number, accessToken: string) {
        this.host = host;
        this.port = port;
        this.accessToken = accessToken;
    }

    public setConnectHandler(handler: () => void) {
        this.connectHandler = handler;
    }

    public setDisconnectHandler(handler: () => void) {
        this.disconnectHandler = handler;
    }

    public setReceiveHandler(handler: (packetId: number, data: object, user: User) => void) {
        this.receiveHandler = handler;
    }

    public setErrorHandler(handler: () => void) {
        this.errorHandler = handler;
    }

    public setUserConnectHandler(handler: (user: User) => void) {
        this.userConnectHandler = handler;
    }

    public setUserDisconnectHandler(handler: (user: User) => void) {
        this.userDisconnectHandler = handler;
    }

    public connect() {
        this.ws = new WebSocket(`ws://${this.host}:${this.port}?access_token=${this.accessToken}`);

        this.ws.onclose = (ev) => {
            if (this.disconnectHandler === undefined) {
                return;
            }
            if (ev.code === 1006) {
                return;
            }
            this.disconnectHandler();
        };
        this.ws.onmessage = (ev) => {
            var rawPacket = RawPacket.parse(ev.data);

            switch (rawPacket.id) {
                case Packets.Welcome:
                    let wPacket = <WelcomePacket>rawPacket.data;
                    this.bindUsers(wPacket);

                    if (this.connectHandler !== undefined) {
                        this.connectHandler();
                    }
                    break;
                case Packets.UserConnect:
                    let ucPacket = <UserConnectPacket>rawPacket.data;
                    var user = this.bindUser(ucPacket);

                    if (this.userConnectHandler !== undefined) {
                        this.userConnectHandler(user);
                    }
                    break
                case Packets.UserDisconnect:
                    let pdPacket = <UserDisconnectPacket>rawPacket.data;
                    var user = this.unbindUser(pdPacket);

                    if (this.userDisconnectHandler !== undefined) {
                        this.userDisconnectHandler(user);
                    }
                    break
                default:
                    if (this.receiveHandler === undefined) {
                        return;
                    }

                    var user = this.findUserByPeerId(rawPacket.sender);
                    this.receiveHandler(rawPacket.id, rawPacket.data, user)
                    break;
            }
        };
        this.ws.onerror = (ev) => {
            if (this.errorHandler === undefined) {
                return;
            }
            this.errorHandler();
        }
    }

    public disconnect() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }

    public isConnected(): boolean {
        if (this.ws === undefined) {
            return false;
        }
        if (this.ws.readyState === WebSocket.OPEN) {
            return true;
        }
        return false;
    }

    private bindUsers(packet: WelcomePacket) {
        this.me = packet.me;
        this.users = packet.users;

        this.connectedUsersByPeerId = {};
        for (let user of this.users) {
            if (user !== null) {
                this.connectedUsersByPeerId[user.peerId] = user;
            }
        }
    }

    private bindUser(packet: UserConnectPacket): User {
        let user = this.findUserByPeerId(packet.peerId);
        this.connectedUsersByPeerId[user.peerId] = user;
        return user;
    }

    private unbindUser(packet: UserDisconnectPacket): User {
        let user = this.findUserByPeerId(packet.peerId);
        delete this.connectedUsersByPeerId[user.peerId];
        return user;
    }

    public findUserByPeerId(peerId: number): User {
        if (1 <= peerId && peerId <= this.users.length) {
            return this.users[peerId - 1];
        }
        return null;
    }

    private sendPacket(rawPacket: RawPacket) {
        var json = JSON.stringify(rawPacket);
        this.ws.send(json);
    }

    public sendPacketToUser(packetId: number, data: object, user: User) {
        var rawPacket = new RawPacket(packetId, data, this.me.peerId);
        rawPacket.addTarget(user);
        this.sendPacket(rawPacket);
    }

    public sendPacketToUsers(packetId: number, data: object, users: User[]) {
        var rawPacket = new RawPacket(packetId, data, this.me.peerId);

        if (users.length > 0) {
            users.forEach(user => {
                rawPacket.addTarget(user);
            });
            this.sendPacket(rawPacket);
        }
    }

    public sendPacketToAll(packetId: number, data: object) {
        var rawPacket = new RawPacket(packetId, data, this.me.peerId);
        rawPacket.targets = [];
        this.sendPacket(rawPacket);
    }

    public sendPacketToAllExcept(packetId: number, data: object, user: User) {
        var rawPacket = new RawPacket(packetId, data, this.me.peerId);

        var peerIds = Object.keys(this.connectedUsersByPeerId);
        peerIds.forEach(peerId => {
            var u = this.connectedUsersByPeerId[peerId];
            if (u.peerId !== user.peerId) {
                rawPacket.addTarget(u);
            }
        });

        this.sendPacket(rawPacket);
    }
}