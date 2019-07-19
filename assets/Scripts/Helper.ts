class Helper {
    public static getURLHost(): string {
        return window.location.host.split(":")[0];
    }

    public static getRandomNumber(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static getDeviceId(): string {
        let deviceId = cc.sys.localStorage.getItem("device_id");
        if (deviceId === null) {
            deviceId = this.getRandomString(16);
            cc.sys.localStorage.setItem("device_id", deviceId);
        }
        return deviceId;
    }

    public static getRandomString(length: number): string {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

export {Helper}