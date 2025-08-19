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

module.exports = {
    addUserToGroups
};