const { CognitoJwtVerifier } = require("aws-jwt-verify");
const config = require('../config');
const aws = require('aws-sdk');

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

            if (payload) {
                req.user = {
                    ...payload,
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

// {
//     "userId": "6883781e7bb05bf9fa256dfb",
//     "ownerId": "6883781e7bb05bf9fa256dfb",
//     "role": "Owner",
//     "email": "mohamed.a@pentabay.com",
//     "timeZone": "Asia/Kolkata",
//     "iat": 1753676717,
//     "exp": 1753763117
// }
