const { CognitoJwtVerifier } = require("aws-jwt-verify");
const config = require('../config');
const aws = require('aws-sdk');
const User = require("../models/user");

const verifier = CognitoJwtVerifier.create({
    userPoolId: config.cognito.userPoolId,
    tokenUse: "id",
    clientId: config.cognito.clientId,
});

const provider = new aws.CognitoIdentityServiceProvider({
    userPoolId: config.cognito.userPoolId,
    clientId: config.cognito.clientId,
    region: 'us-east-1'
});

const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            console.log("token : " + token)

            if (!token) return res.status(401).json({ code: 401, status: 'Failed', message: 'Access denied.' });

            const payload = await verifier.verify(token);
            console.log(payload, "payload")
            const users = await User.findOne({ cognitoId: payload.sub });
            console.log(users, "usersusersusersusersusers **********",users?._id?.toString())
            if (payload) {
                req.user = {
                    ...payload,
                    userId:users?._id?.toString(),
                    timeZone: "Asia/Kolkata",
                };
                next();
            } else {
                res.status(401).json({ code: 401, status: 'Failed', message: 'Invalid Token.' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ code: 401, status: 'Failed', message: 'Invalid Token.' });
    }
};

module.exports = { validateToken, provider };
