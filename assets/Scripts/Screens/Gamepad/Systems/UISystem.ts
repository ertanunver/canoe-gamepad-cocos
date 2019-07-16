// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GamepadScreenResources from "../GamepadScreenResources";
import Sprite = cc.Sprite;

const {ccclass, property} = cc._decorator;

@ccclass
export default class UISystem extends cc.Component {

    public onChangeAvatarButtonClick: (avatarId) => void;

    private _resources: GamepadScreenResources;

    private _avatarSprite: Sprite;


    private _selectedAvatarId = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this._resources = this.getComponent(GamepadScreenResources);

        this._avatarSprite = cc.find("Canvas/UI/LobbyStage/AvatarSprite").getComponent(Sprite);
    }

    private changeAvatarButtonClicked(event, customEventData) {
        this._selectedAvatarId = (this._selectedAvatarId + parseInt(customEventData)) % this._resources.avatarFrames.length;
        if (this._selectedAvatarId < 0) this._selectedAvatarId = this._resources.avatarFrames.length - 1;
        if (this.onChangeAvatarButtonClick !== undefined) this.onChangeAvatarButtonClick(this._selectedAvatarId);
    }

    public changeAvatar(avatarId) {
        this._selectedAvatarId = avatarId;
        this._avatarSprite.spriteFrame = this._resources.avatarFrames[this._selectedAvatarId];
    }

    // update (dt) {}
}
