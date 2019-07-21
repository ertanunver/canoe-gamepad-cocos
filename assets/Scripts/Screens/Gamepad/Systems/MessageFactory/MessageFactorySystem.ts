// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {MessageCodes} from "./MessageCodes";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageFactorySystem extends cc.Component {

    public onStartGameMessage: (position: number, avatars: number[]) => void;

    public produce(code: number, data: string) {
        switch (code) {
            case MessageCodes.StartGame:
                let message = JSON.parse(data);
                if (this.onStartGameMessage !== undefined) this.onStartGameMessage(message.position,message.avatars);
                break;
        }
    }
}
