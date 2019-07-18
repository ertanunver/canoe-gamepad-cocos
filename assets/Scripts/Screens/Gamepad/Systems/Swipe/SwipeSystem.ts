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
export default class SwipeSystem extends cc.Component {

    public onUpSwipe: () => void;
    public onDownSwipe: () => void;

    private _swipeArea: cc.Node;

    onLoad () {
        this._swipeArea = cc.find("Canvas/UI/GameStage/SwipeArea");
    }

    start () {
        let y;

        this._swipeArea.on(cc.Node.EventType.TOUCH_START.toString(), function (e) {
            y = e.getLocationY();
        }, this);
        this._swipeArea.on(cc.Node.EventType.TOUCH_END.toString(), function (e) {
            let offset = e.getLocationY() - y;
            if (offset < 0) {
                if (this.onDownSwipe !== undefined) this.onDownSwipe();
            } else if (offset > 0) {
                if (this.onUpSwipe !== undefined) this.onUpSwipe();
            }
        }, this);
    }

    // update (dt) {}
}
