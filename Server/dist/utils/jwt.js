"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTokenToRedis = exports.refreshTokenOptions = exports.acccesTokenOptions = void 0;
require("dotenv").config();
const Redis_1 = require("./Redis");
// Token expiration times from environment variables
const acccesTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '1', 10); // Expiry set to 1 day
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '5', 10); // Expiry set to 5 days
// Current time in milliseconds
const currentTime = Date.now();
// Local time zone offset in milliseconds
const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60 * 1000;
// Local token expiration times
const localAccessTokenExpiry = new Date(currentTime + acccesTokenExpire * 24 * 60 * 60 * 1000 + timezoneOffsetInMs); // 1 day
const localRefreshTokenExpiry = new Date(currentTime + refreshTokenExpire * 24 * 60 * 60 * 1000 + timezoneOffsetInMs); // 5 days
// Format the local expiration times as strings
const localAccessTokenExpiryString = localAccessTokenExpiry.toLocaleString(); // Convert to local time string
const localRefreshTokenExpiryString = localRefreshTokenExpiry.toLocaleString(); // Convert to local time string
console.log("Node Env Check", process.env.NODE_ENV);
exports.acccesTokenOptions = {
    expires: localAccessTokenExpiry,
    maxAge: acccesTokenExpire * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: 'none',
    secure: true,
};
exports.refreshTokenOptions = {
    expires: localRefreshTokenExpiry,
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // 5 days in milliseconds
    httpOnly: true,
    sameSite: 'none',
    secure: true,
};
// console.log('Current Server Time (UTC):', new Date(currentTime).toLocaleString());
// console.log('Access Token Expiry (Local):', localAccessTokenExpiryString);
// console.log('Refresh Token Expiry (Local):', localRefreshTokenExpiryString);
const SendTokenToRedis = (user, statusCode, res) => {
    const accessToken = user.signAcessToken();
    const refreshToken = user.signrefreshToken();
    Redis_1.redis.set(String(user._id), JSON.stringify(user));
    res.cookie("access_token", accessToken, exports.acccesTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};
exports.SendTokenToRedis = SendTokenToRedis;
//# sourceMappingURL=jwt.js.map