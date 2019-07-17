import {Message} from '../../../../../Managers/WebSocket/Message'
import {MessageCodes} from "../MessageCodes";

class ChangeAvatarMessage extends Message {
    public avatarId: Number;

    constructor(avatarId: Number) {
        super(MessageCodes.ChangeAvatar);
        this.avatarId = avatarId;
    }
}

export {ChangeAvatarMessage};