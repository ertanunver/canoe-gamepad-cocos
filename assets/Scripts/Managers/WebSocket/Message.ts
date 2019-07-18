class Message {
    public code: number;

    constructor(code: number) {
        this.code = code;
    }

    public toJson() {
        return JSON.stringify(this);
    }
}

export {Message};