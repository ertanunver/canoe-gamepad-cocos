// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {Message} from "./Message";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WebSocketManager extends cc.Component {

    public onConnect: () => void;
    public onDisconnect: () => void;
    public onErrorOccur: () => void;
    public onMessageReceive: (data: String) => void;

    private _socket: WebSocket;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    // private

    public connect(host: string, port: number) {
        this._socket = new WebSocket("ws://" + host + ":" + port);

        this._socket.onopen = () => {
            if (this.onConnect !== undefined) this.onConnect();
        };
        this._socket.onclose = () => {
            if (this.onDisconnect !== undefined) this.onDisconnect();
        };
        this._socket.onerror = () => {
            if (this.onErrorOccur !== undefined) this.onErrorOccur();
        };
        this._socket.onmessage = (e) => {
            if (this.onMessageReceive !== undefined) this.onMessageReceive(e.data);
        };
    }

    public disconnect() {
        this._socket.close();

        this._socket.onopen = null;
        this._socket.onclose = null;
        this._socket.onerror = null;
        this._socket.onmessage = null;
    }

    public send(message: Message) {
        console.log(message.toJson());
        this._socket.send(message.toJson());
    }
}
