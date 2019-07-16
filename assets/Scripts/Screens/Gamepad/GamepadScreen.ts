// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import WebSocketManager from "../../Managers/WebSocketManager";
import UISystem from "./Systems/UISystem";
import GamepadScreenResources from "./GamepadScreenResources";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamepadScreen extends cc.Component {

    private _resources: GamepadScreenResources;

    private _wsManager: WebSocketManager;

    private _uiSystem: UISystem;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this._resources = this.getComponent(GamepadScreenResources);

        this._wsManager = this.getComponent(WebSocketManager);

        this._wsManager.onConnect = () => this.onConnect();
        this._wsManager.onDisconnect = () => this.onDisconnect();
        this._wsManager.onErrorOccur = () => this.onErrorOccur();
        this._wsManager.onMessageReceive = (data) => this.onMessageReceive(data);

        this._uiSystem = this.getComponent(UISystem);

        this._uiSystem.onChangeAvatarButtonClick = (avatarId) => this.onChangeAvatarButtonClick(avatarId);

        this.connect();
    }

    private connect() {
        let host = this.getURLHost();
        let port = 81;

        this._wsManager.connect(host, port);
    }

    private onConnect() {
        console.log("onConnect");

        // set avatar randomly
        let avatarId = this.getRandomNumber(0, this._resources.avatarFrames.length - 1);
        this._uiSystem.changeAvatar(avatarId);
    }

    private onDisconnect() {
        console.log("onDisconnect");
    }

    private onErrorOccur() {
        console.log("onErrorOccur");
    }

    private onMessageReceive(data: String) {
        console.log("onMessageReceive: " + data);
    }

    private onChangeAvatarButtonClick(avatarId) {
        console.log(avatarId);
        this._uiSystem.changeAvatar(avatarId);
    }


    // helpers
    private getURLHost() {
        return window.location.host.split(":")[0];
    }

    private getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // update (dt) {}
}
