// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass} = cc._decorator;

@ccclass
export default class SwipeSystem extends cc.Component {

    public onUpSwipe: () => void;
    public onDownSwipe: () => void;

    private _swipeArea: cc.Node;

    onLoad() {
        this._swipeArea = cc.find("Canvas/UI/GameStage/SwipeArea");
    }

    start() {
        let y;
        let graphics = this._swipeArea.getComponent(cc.Graphics);
        let isDrawingStarted = false;

        this._swipeArea.on(cc.Node.EventType.TOUCH_START.toString(), function (e) {
            y = e.getLocationY();
        }, this);
        this._swipeArea.on(cc.Node.EventType.TOUCH_MOVE.toString(), function (e) {
            if (!isDrawingStarted) {
                graphics.clear(false);
                graphics.moveTo(e.getLocation().x, e.getLocation().y);
                isDrawingStarted = true;
            } else {
                graphics.lineTo(e.getLocation().x, e.getLocation().y);
                graphics.stroke();
            }
        }, this);
        this._swipeArea.on(cc.Node.EventType.TOUCH_END.toString(), function (e) {
            isDrawingStarted = false;

            let offset = e.getLocationY() - y;
            if (Math.abs(offset) < 2) return;

            if (offset < 0) {
                if (this.onDownSwipe !== undefined) this.onDownSwipe();
            } else if (offset > 0) {
                if (this.onUpSwipe !== undefined) this.onUpSwipe();
            }
        }, this);



        // graphics.lineTo();
        //
        // graphics.lineTo(20, 20);
        // graphics.lineTo(70, 20);
        // graphics.stroke();
    }

    update() {
        // console.log("update");
    }
}
