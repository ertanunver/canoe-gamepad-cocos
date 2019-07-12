// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NakamaSystem extends cc.Component {

    @property
    serverKey: string = '9DJBwgj5bL7ywwfGMW6Vlc0lRorqL3jL';
    @property
    host: string = '10.104.148.61';
    @property
    port: number = 8085;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // var client = new k.Client(serverkey, host, port, useSSL, timeout);
        nakamajs.Client
    }

    // update (dt) {}

    getQueryData (key) {
        return new URL("http://example.com" + document.location.search).searchParams.get(key);
    }
}
