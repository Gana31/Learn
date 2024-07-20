"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivationToken = void 0;
require("dotenv").config();
const jsonwebtoken_1 = require("jsonwebtoken");
const CreateActivationToken = (FirstName, LastName, email, password, role) => {
    const user = { LastName, FirstName, email, password, role };
    // console.log("from createActivationToken ", user)
    const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const Token = (0, jsonwebtoken_1.sign)({ user, ActivationCode }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    return { Token, ActivationCode };
};
exports.CreateActivationToken = CreateActivationToken;
//# sourceMappingURL=ActivatinToken.js.map