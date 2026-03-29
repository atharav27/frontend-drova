"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
/**
 * Shared logout utility function
 * Clears all localStorage data and redirects to login page
 */
const logout = (redirectPath = "/login") => {
    // Clear all localStorage data (including accessToken, refreshToken, etc.)
    localStorage.clear();
    // Redirect to login page
    window.location.href = redirectPath;
};
exports.logout = logout;
exports.default = exports.logout;
