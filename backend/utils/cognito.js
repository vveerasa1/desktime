const AWS = require("aws-sdk");
const config = require("../config");

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: config.AWS.region,
    accessKeyId: config.AWS.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
});

async function addUserToGroups(username, userPoolId, groups) {

    try {
        for (const group of groups) {
            await cognito.adminAddUserToGroup({
                UserPoolId: userPoolId,
                Username: username,
                GroupName: group
            }).promise();
        }
    } catch (error) {
        console.error("Error adding user to groups:", error);
        throw new Error("Failed to add user to groups");
    }
}

async function handleRefreshToken(refreshToken, clientId) {
    try {
        const params = {
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: clientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
            },
        };
        const response = await cognito.initiateAuth(params).promise();
        console.log("New tokens:", response.AuthenticationResult);
        return response.AuthenticationResult; // contains access_token, id_token, etc.
    } catch (error) {
        console.error("Refresh token failed:", error.message);
        if (error.code === 'NotAuthorizedException') {
            throw new Error("Refresh token expired or invalid");
        }
        throw error;
    }
}
module.exports = {
    addUserToGroups,
    handleRefreshToken
};