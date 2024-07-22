require("dotenv").config();
import { Response } from "express";
import { UserSchemaInterface } from "../models/user.model";
import { redis } from "./Redis";

interface InterfaceTokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    Secure?: boolean;
}

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

export const acccesTokenOptions: InterfaceTokenOptions = {
    expires: localAccessTokenExpiry,
    maxAge: acccesTokenExpire * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: 'none',
    Secure:  process.env.NODE_ENV === 'production',
};

export const refreshTokenOptions: InterfaceTokenOptions = {
    expires: localRefreshTokenExpiry,
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // 5 days in milliseconds
    httpOnly: true,
    sameSite: 'none',
    Secure:  process.env.NODE_ENV === 'production',
};

// console.log('Current Server Time (UTC):', new Date(currentTime).toLocaleString());
// console.log('Access Token Expiry (Local):', localAccessTokenExpiryString);
// console.log('Refresh Token Expiry (Local):', localRefreshTokenExpiryString);

export const SendTokenToRedis = (user: UserSchemaInterface, statusCode: number, res: Response) => {
    const accessToken = user.signAcessToken();
    const refreshToken = user.signrefreshToken();

    redis.set(String(user._id), JSON.stringify(user));

    res.cookie("access_token", accessToken, acccesTokenOptions);
    res.cookie("refresh_token", refreshToken,refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
}
