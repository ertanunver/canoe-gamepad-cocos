import {Message} from '../../../../../Managers/WebSocket/Message'
import {MessageCodes} from "../MessageCodes";

class ChangeAvatarMessage extends Message {
    public avatarId: number;

    constructor(avatarId: number) {
        super(MessageCodes.ChangeAvatar);
        this.avatarId = avatarId;
    }
}

export {ChangeAvatarMessage};