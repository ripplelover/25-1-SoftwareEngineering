"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth = function (req, res, next) {
    var token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }
    try {
        var decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};
exports["default"] = auth;
