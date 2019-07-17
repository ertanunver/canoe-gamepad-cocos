class Helper {
    public static getURLHost(): string {
        return window.location.host.split(":")[0];
    }

    public static getRandomNumber(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export {Helper}