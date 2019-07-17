import {Message} from '../../../../../Managers/WebSocket/Message'
import {MessageCodes} from "../MessageCodes";

class ChangeStateMessage extends Message {
    public isReady: boolean;

    constructor(isReady: boolean) {
        super(MessageCodes.ChangeState);
        this.isReady = isReady;
    }
}

export {ChangeStateMessage};