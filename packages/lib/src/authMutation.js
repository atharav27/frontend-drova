"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthMutation = handleAuthMutation;
const localStorage_1 = require("./localStorage");
const apiFetch_1 = require("./apiFetch");
async function handleAuthMutation(endpoint, data) {
    const response = await (0, apiFetch_1.apiFetch)(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;
    if (accessToken && refreshToken) {
        (0, localStorage_1.setLocalStorageValue)("accessToken", accessToken);
        (0, localStorage_1.setLocalStorageValue)("refreshToken", refreshToken);
    }
    return response;
}
