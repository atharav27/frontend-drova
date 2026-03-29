"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLocalStorage = exports.removeLocalStorageValue = exports.setLocalStorageValue = exports.getLocalStorageValue = void 0;
const isBrowser = typeof window !== 'undefined';
const getLocalStorageValue = (key) => {
    if (isBrowser) {
        return localStorage.getItem(key);
    }
    return null;
};
exports.getLocalStorageValue = getLocalStorageValue;
const setLocalStorageValue = (key, value) => {
    if (isBrowser) {
        localStorage.setItem(key, value);
    }
};
exports.setLocalStorageValue = setLocalStorageValue;
const removeLocalStorageValue = (key) => {
    if (isBrowser) {
        localStorage.removeItem(key);
    }
};
exports.removeLocalStorageValue = removeLocalStorageValue;
const clearLocalStorage = () => {
    if (isBrowser) {
        localStorage.clear();
    }
};
exports.clearLocalStorage = clearLocalStorage;
// For backward compatibility
exports.default = getLocalStorageValue;
