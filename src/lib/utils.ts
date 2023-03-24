declare global {
    interface String {
        toTitleCase(): string;
        containsAny(chars: string[]): boolean;
    }
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

String.prototype.containsAny = function (chars: string[]) {
    return chars.some((char) => this.includes(char));
}

export {};