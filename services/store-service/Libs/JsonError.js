module.exports = class JsonError extends Error {
    constructor(obj) {
        super(obj.message);
        this._obj = obj;
    }

    get json() {
        return JSON.parse(JSON.stringify(this));
    }

    get httpCode() {
        return this._obj.httpCode;
    }

    toJSON() {
        return {
            code: this._obj.code,
            message: this._obj.message,
        }
    }
}