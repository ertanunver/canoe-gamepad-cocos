import {Message} from '../../../../../Managers/WebSocket/Message'
import {MessageCodes} from "../MessageCodes";

class SwipeMessage extends Message {
    public direction: string;

    constructor(direction: string) {
        super(MessageCodes.Swipe);
        this.direction = direction;
    }
}

export {SwipeMessage};