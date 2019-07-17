class Message {
    public code: Number;

    constructor(code: Number) {
        this.code = code;
    }

    public toJson() {
        return JSON.stringify(this);
    }
}

export {Message};